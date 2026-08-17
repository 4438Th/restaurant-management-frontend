import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { useQueryClient } from '@tanstack/react-query';
import {
    useCreateReservation,
    useUpdateReservation,
    useCancelReservation,
    useConfirmDeposit,
    useCheckInReservation,
    type TableReservationCreateRequest,
    type TableReservationUpdateRequest,
    type TableReservationResponse,
    type ConfirmDepositRequest,
} from '@repo/shared-features/reservations';
import { orderKeys } from '@repo/shared-features/order';
import { usePosStore } from '@/stores/use-pos-store';
import type { ReservationFormData, PreOrderItem } from '../types';
import { formatLocalInputToLocalDateTime } from '../utils/reservation-form.utils';

export function useReservationActions(onSuccess: () => void) {
    const queryClient = useQueryClient();
    const create = useCreateReservation();
    const update = useUpdateReservation();
    const cancel = useCancelReservation();
    const confirmDeposit = useConfirmDeposit();
    const checkIn = useCheckInReservation();

    const setSelectedTableId = usePosStore((state) => state.setSelectedTableId);

    const handleFormSubmit = (
        formData: ReservationFormData,
        preOrderItems: PreOrderItem[],
        editingItem: TableReservationResponse | null
    ) => {
        const items = preOrderItems.map((item) => ({
            dishId: item.dish.id,
            quantity: item.quantity,
        }));

        if (editingItem) {
            const payload: TableReservationUpdateRequest = {
                tableId: formData.tableId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                guestCount: formData.guestCount,
                reservationTime: formatLocalInputToLocalDateTime(formData.reservationTime),
                note: formData.note,
            };

            update.mutate(
                { id: editingItem.id, payload },
                {
                    onSuccess: () => {
                        toast.success('Đã cập nhật lịch đặt bàn thành công!');
                        onSuccess();
                    },
                    onError: (err: ApiError) =>
                        toast.error(err.message || 'Cập nhật thất bại!'),
                }
            );
        } else {
            const payload: TableReservationCreateRequest = {
                tableId: formData.tableId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                guestCount: formData.guestCount,
                reservationTime: formatLocalInputToLocalDateTime(formData.reservationTime),
                note: formData.note,
                preOrderItems: items.length > 0 ? items : undefined,
            };

            create.mutate(payload, {
                onSuccess: () => {
                    toast.success('Đã tạo lịch đặt bàn mới thành công!');
                    onSuccess();
                },
                onError: (err: ApiError) =>
                    toast.error(err.message || 'Tạo mới thất bại!'),
            });
        }
    };

    const handleConfirmDeposit = (id: string, payload: ConfirmDepositRequest) => {
        confirmDeposit.mutate(
            { id, payload },
            {
                onSuccess: () => {
                    toast.success('Đã xác nhận tiền cọc thành công!');
                    onSuccess();
                },
                onError: (err: ApiError) =>
                    toast.error(err.message || 'Xác nhận cọc thất bại!'),
            }
        );
    };

    const handleCheckIn = (reservation: TableReservationResponse) => {
        checkIn.mutate(reservation.id, {
            onSuccess: () => {
                toast.success('Check-in thành công cho bàn!');

                // 1. Invalidate cache để các Component đang dùng useQuery tự làm mới dữ liệu
                queryClient.invalidateQueries({ queryKey: ['tables'] });
                queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

                // 2. Chuyển active bàn trên Zustand POS Store
                if (reservation.tableId) {
                    setSelectedTableId(reservation.tableId);
                }

                onSuccess();
            },
            onError: (err: ApiError) => {
                toast.error(err.message || 'Check-in thất bại!');
            },
        });
    };

    const handleCancel = (id: string, cancelReason: string) => {
        cancel.mutate(
            { id, payload: { cancelReason } },
            {
                onSuccess: () => {
                    toast.success('Đã hủy lịch đặt bàn thành công!');
                    onSuccess();
                },
                onError: (err: ApiError) =>
                    toast.error(err.message || 'Hủy đặt bàn thất bại!'),
            }
        );
    };

    return {
        handleFormSubmit,
        handleCheckIn,
        handleConfirmDeposit,
        handleCancel,
        isFormPending: create.isPending || update.isPending,
        isConfirmPending: confirmDeposit.isPending,
        isCancelPending: cancel.isPending,
        isArrivePending: checkIn.isPending,
    };
}