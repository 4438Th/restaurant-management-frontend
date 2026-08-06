import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ApiError, type CursorPageResponse } from "@repo/core";
import {
  useReservation,
  useCreateReservation,
  useUpdateReservation,
  useArriveReservation,
  useCompleteReservation,
  useNoShowReservation,
  useCancelReservation,
  TableReservationStatus,
  type TableReservationResponse,
  type TableReservationCreateRequest,
  type TableReservationUpdateRequest,
  type TableReservationCancelRequest,
  type TableReservationFilterParams,
} from "@repo/shared-features/reservations";
import { type TableResponse, useTable } from "@repo/shared-features/tables";
import { AppLayout } from "@/components/layouts";
import { Icon } from "@repo/ui";
import {
  ReservationToolbar,
  ReservationTable,
  ReservationCancelModal,
  ReservationFormModal,
} from "@/features/reservations";

export function ReservationPage() {
  // Trạng thái nhập liệu từ khóa tìm kiếm & Filter tức thời trên UI
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // State bộ lọc chuẩn CursorPageParams
  const [filters, setFilters] = useState<TableReservationFilterParams>({
    cursor: undefined,
    size: 10,
    search: undefined,
    status: undefined,
  });

  // State Modal Form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] =
    useState<TableReservationResponse | null>(null);

  // State Modal Hủy
  const [cancelModalItem, setCancelModalItem] =
    useState<TableReservationResponse | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Debounce Search & Filter Sync (Reset cursor về undefined khi đổi điều kiện tìm kiếm)
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        cursor: undefined,
        size: 10,
        search: searchQuery.trim() || undefined,
        status:
          selectedStatus === "ALL"
            ? undefined
            : (selectedStatus as TableReservationStatus),
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedStatus]);

  // Hook Lấy danh sách bàn ăn
  const { data: tablesData } = useTable({ page: 1, size: 100 });
  const tables: TableResponse[] = tablesData?.data || [];

  // Hook Lấy danh sách lịch đặt bàn
  const {
    data: rawPageData,
    isLoading: isFetchLoading,
    isError,
    refetch,
  } = useReservation(filters);

  // Type assertion bảo đảm khớp CursorPageResponse<TableReservationResponse>
  const pageData = rawPageData as unknown as
    | CursorPageResponse<TableReservationResponse>
    | undefined;
  const reservationsList: TableReservationResponse[] = pageData?.data || [];

  // Hooks Mutation API
  const createMutation = useCreateReservation();
  const updateMutation = useUpdateReservation();
  const arriveMutation = useArriveReservation();
  const completeMutation = useCompleteReservation();
  const noShowMutation = useNoShowReservation();
  const cancelMutation = useCancelReservation();

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  // 1. XỬ LÝ SUBMIT FORM (TẠO / CẬP NHẬT)
  const handleFormSubmit = (
    data: TableReservationCreateRequest | TableReservationUpdateRequest,
  ) => {
    if (editingItem) {
      updateMutation.mutate(
        {
          id: editingItem.id,
          payload: data as TableReservationUpdateRequest,
        },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật lịch đặt bàn thành công!");
            setIsFormOpen(false);
            setEditingItem(null);
          },
          onError: (error: ApiError) => {
            toast.error(
              error.message || "Cập nhật thông tin đặt bàn thất bại!",
            );
          },
        },
      );
    } else {
      createMutation.mutate(data as TableReservationCreateRequest, {
        onSuccess: () => {
          toast.success("Đã tạo lịch đặt bàn mới thành công!");
          setIsFormOpen(false);
          setEditingItem(null);
        },
        onError: (error: ApiError) => {
          toast.error(error.message || "Tạo lịch đặt bàn mới thất bại!");
        },
      });
    }
  };

  // 2. XỬ LÝ HỦY ĐẶT BÀN
  const handleConfirmCancel = () => {
    if (!cancelModalItem || !cancelReason.trim()) return;

    const cancelPayload: TableReservationCancelRequest = { cancelReason };

    cancelMutation.mutate(
      {
        id: cancelModalItem.id,
        payload: cancelPayload,
      },
      {
        onSuccess: () => {
          toast.success("Đã hủy lịch đặt bàn thành công!");
          setCancelModalItem(null);
          setCancelReason("");
        },
        onError: (error: ApiError) => {
          toast.error(error.message || "Không thể hủy lịch đặt bàn!");
        },
      },
    );
  };

  // 3. CÁC HÀNH ĐỘNG THAY ĐỔI TRẠNG THÁI
  const handleArrive = (id: string) => {
    arriveMutation.mutate(id, {
      onSuccess: () => toast.success("Khách đã nhận bàn thành công!"),
      onError: (err: ApiError) =>
        toast.error(err.message || "Chuyển trạng thái nhận bàn thất bại!"),
    });
  };

  const handleComplete = (id: string) => {
    completeMutation.mutate(id, {
      onSuccess: () => toast.success("Đã hoàn tất lượt đặt bàn!"),
      onError: (err: ApiError) =>
        toast.error(err.message || "Chuyển trạng thái hoàn tất thất bại!"),
    });
  };

  const handleNoShow = (id: string) => {
    noShowMutation.mutate(id, {
      onSuccess: () => toast.info("Đã đánh dấu khách không đến (No-show)."),
      onError: (err: ApiError) =>
        toast.error(err.message || "Chuyển trạng thái thất bại!"),
    });
  };

  // 4. XỬ LÝ CHUYỂN TRANG THEO CURSOR
  const handleLoadNextPage = () => {
    if (pageData?.hasNext && pageData?.nextCursor) {
      setFilters((prev) => ({
        ...prev,
        cursor: pageData.nextCursor,
      }));
    }
  };

  const handleResetCursor = () => {
    setFilters((prev) => ({
      ...prev,
      cursor: undefined,
    }));
  };

  return (
    <AppLayout title="Quản lý lịch đặt bàn">
      <div className="flex flex-col gap-4 h-full">
        {/* Toolbar */}
        <ReservationToolbar
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onStatusChange={setSelectedStatus}
          onCreateNew={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        />

        {/* Card Container bọc Bảng */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex flex-col shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ReservationTable
              reservations={reservationsList}
              isLoading={isFetchLoading}
              isError={isError}
              onRetry={refetch}
              onEdit={(item) => {
                setEditingItem(item);
                setIsFormOpen(true);
              }}
              onArrive={handleArrive}
              onComplete={handleComplete}
              onNoShow={handleNoShow}
              onRequestCancel={setCancelModalItem}
            />
          </div>

          {/* Thanh phân trang Cursor-based Chân bảng */}
          {pageData && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant shrink-0 bg-surface-container-lowest text-xs text-on-surface-variant">
              <div>
                {filters.cursor ? (
                  <button
                    type="button"
                    onClick={handleResetCursor}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    ← Quay lại trang đầu
                  </button>
                ) : (
                  <span>Đang ở trang đầu tiên</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pageData.hasNext || isFetchLoading}
                  onClick={handleLoadNextPage}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
                >
                  <span>Trang tiếp theo</span>
                  <Icon name="ChevronRight" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Tạo/Sửa */}
      <ReservationFormModal
        key={editingItem ? editingItem.id : "new"}
        isOpen={isFormOpen}
        tables={tables}
        initialData={editingItem}
        isSubmitting={isFormPending}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Modal Xác nhận hủy */}
      <ReservationCancelModal
        item={cancelModalItem}
        reason={cancelReason}
        isSubmitting={cancelMutation.isPending}
        onReasonChange={setCancelReason}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          setCancelModalItem(null);
          setCancelReason("");
        }}
      />
    </AppLayout>
  );
}
