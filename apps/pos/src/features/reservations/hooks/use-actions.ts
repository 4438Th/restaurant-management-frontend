import { toast } from "sonner";
import { ApiError } from "@repo/core";
import {
    useCreateReservation,
    useUpdateReservation,
    useCancelReservation,
    useConfirmReservation,
    useArriveReservation,
    useCompleteReservation,
    useNoShowReservation,
    type TableReservationCreateRequest,
    type TableReservationUpdateRequest,
    type TableReservationResponse
} from "@repo/shared-features/reservations";
import { usePosStore } from "@/stores/use-pos-store";

export function useActions(onSuccess: () => void) {
    const create = useCreateReservation();
    const update = useUpdateReservation();
    const cancel = useCancelReservation();
    const confirm = useConfirmReservation();
    const arrive = useArriveReservation();
    const complete = useCompleteReservation();
    const noShow = useNoShowReservation();

    const setSelectedTableId = usePosStore((state) => state.setSelectedTableId);

    const handleFormSubmit = (
        data: TableReservationCreateRequest | TableReservationUpdateRequest,
        editingItem: TableReservationResponse | null
    ) => {
        if (editingItem) {
            update.mutate(
                {
                    id: editingItem.id,
                    payload: data as TableReservationUpdateRequest
                },
                {
                    onSuccess: () => {
                        toast.success("Đã cập nhật lịch đặt bàn thành công!");
                        onSuccess();
                    },
                    onError: (err: ApiError) => toast.error(err.message || "Cập nhật thất bại!")
                }
            );
        } else {
            create.mutate(
                data as TableReservationCreateRequest,
                {
                    onSuccess: () => {
                        toast.success("Đã tạo lịch đặt bàn mới thành công!");
                        onSuccess();
                    },
                    onError: (err: ApiError) => toast.error(err.message || "Tạo mới thất bại!")
                }
            );
        }
    };

    /**
     * Xử lý xác nhận lịch đặt bàn
     */
    const handleConfirm = (id: string) => {
        confirm.mutate(id, {
            onSuccess: () => {
                toast.success("Đã xác nhận lịch đặt bàn thành công!");
                onSuccess();
            },
            onError: (err: ApiError) => toast.error(err.message || "Xác nhận thất bại!")
        });
    };

    /**
     * Xử lý Check-in: Gọi API arrive ở BE -> Set bàn POS -> Chuyển hướng sang POS
     */
    const handleArrive = (reservation: TableReservationResponse) => {
        arrive.mutate(reservation.id, {
            onSuccess: () => {
                toast.success(`Check-in thành công cho bàn ${reservation.tableName || ""}!`);

                if (reservation.tableId) {
                    setSelectedTableId(reservation.tableId);
                }

                onSuccess();
            },
            onError: (err: ApiError) => {
                toast.error(err.message || "Check-in thất bại!");
            }
        });
    };

    /**
     * Xử lý hoàn tất lịch đặt bàn
     */
    const handleComplete = (id: string) => {
        complete.mutate(id, {
            onSuccess: () => {
                toast.success("Đã hoàn tất lịch đặt bàn!");
                onSuccess();
            },
            onError: (err: ApiError) => toast.error(err.message || "Thực hiện thất bại!")
        });
    };

    /**
     * Xử lý ghi nhận khách vắng mặt
     */
    const handleNoShow = (id: string) => {
        noShow.mutate(id, {
            onSuccess: () => {
                toast.success("Đã ghi nhận khách vắng mặt!");
                onSuccess();
            },
            onError: (err: ApiError) => toast.error(err.message || "Thực hiện thất bại!")
        });
    };

    return {
        handleFormSubmit,
        handleArrive,
        handleConfirm,
        handleComplete,
        handleNoShow,
        cancel, // Vẫn giữ nguyên cancel nếu đang xử lý qua modal riêng
        isFormPending: create.isPending || update.isPending,
        isConfirmPending: confirm.isPending,
        isCancelPending: cancel.isPending,
        isArrivePending: arrive.isPending,
        isCompletePending: complete.isPending,
        isNoShowPending: noShow.isPending
    };
}