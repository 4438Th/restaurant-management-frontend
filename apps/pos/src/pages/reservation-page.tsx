import { AppLayout } from "@/components/layouts";
import { Icon } from "@repo/ui";
import { useTable } from "@repo/shared-features/tables";
import { type TableReservationResponse } from "@repo/shared-features/reservations";
import {
  ReservationToolbar,
  ReservationTable,
  ReservationCancelModal,
  ReservationFormModal,
  useReservationState,
  useFilters,
  useActions,
  getInitialReservationFormData,
  formatLocalInputToLocalDateTime,
  type ReservationFormData,
} from "@/features/reservations";
import { useState } from "react";

export function ReservationPage() {
  const ui = useReservationState();
  const filters = useFilters();
  const actions = useActions(() => {
    ui.setIsFormOpen(false);
    ui.setEditingItem(null);
  });

  const { data: tablesData } = useTable({ size: 100 });

  // State quản lý giá trị form theo mô hình Pure UI
  const [formData, setFormData] = useState<ReservationFormData>(() =>
    getInitialReservationFormData(null, tablesData?.data?.[0]?.id),
  );

  // Cập nhật formData khi mở form tạo mới hoặc chỉnh sửa
  const handleOpenCreate = () => {
    setFormData(getInitialReservationFormData(null, tablesData?.data?.[0]?.id));
    ui.setEditingItem(null);
    ui.setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TableReservationResponse) => {
    setFormData(getInitialReservationFormData(item));
    ui.setEditingItem(item);
    ui.setIsFormOpen(true);
  };

  const handleFormChange = (
    field: keyof ReservationFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.tableId ||
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.reservationTime
    ) {
      return;
    }

    const payloadTime = formatLocalInputToLocalDateTime(
      formData.reservationTime,
    );

    const payload = {
      tableId: formData.tableId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      guestCount: formData.guestCount,
      reservationTime: payloadTime,
      note: formData.note || undefined,
    };

    actions.handleFormSubmit(payload, ui.editingItem);
  };

  return (
    <AppLayout title="Quản lý lịch đặt bàn">
      <div className="flex flex-col gap-4 h-full">
        <ReservationToolbar
          searchQuery={filters.searchQuery}
          selectedStatus={filters.selectedStatus}
          onSearchChange={filters.setSearchQuery}
          onStatusChange={filters.setSelectedStatus}
          onCreateNew={handleOpenCreate}
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex flex-col shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ReservationTable
              reservations={filters.reservations}
              isLoading={filters.isLoading}
              isError={filters.isError}
              onRetry={filters.refetch}
              onEdit={handleOpenEdit}
              onConfirm={(id) => actions.handleConfirm(id)}
              onArrive={(item) => actions.handleArrive(item)}
              onComplete={(id) => actions.handleComplete(id)}
              onNoShow={(id) => actions.handleNoShow(id)}
              onRequestCancel={ui.setCancelModalItem}
            />
          </div>

          {filters.pageData && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant shrink-0 bg-surface-container-lowest text-xs text-on-surface-variant">
              <button
                onClick={filters.resetCursor}
                disabled={!filters.filters.cursor}
                className="text-primary hover:underline font-medium"
              >
                {filters.filters.cursor
                  ? "← Quay lại trang đầu"
                  : "Đang ở trang đầu"}
              </button>
              <button
                disabled={!filters.pageData.hasNext || filters.isLoading}
                onClick={filters.loadNextPage}
                className="px-3 py-1.5 rounded-lg border flex items-center gap-1 hover:bg-surface-container"
              >
                Trang tiếp theo <Icon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ReservationFormModal
        isOpen={ui.isFormOpen}
        tables={tablesData?.data || []}
        isEditMode={Boolean(ui.editingItem)}
        isSubmitting={actions.isFormPending}
        formData={formData}
        onChange={handleFormChange}
        onClose={() => ui.setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ReservationCancelModal
        item={ui.cancelModalItem}
        reason={ui.cancelReason}
        isSubmitting={actions.isCancelPending}
        onReasonChange={ui.setCancelReason}
        onConfirm={() =>
          actions.cancel.mutate(
            {
              id: ui.cancelModalItem!.id,
              payload: { cancelReason: ui.cancelReason },
            },
            {
              onSuccess: () => {
                ui.setCancelModalItem(null);
                ui.setCancelReason("");
              },
            },
          )
        }
        onClose={() => ui.setCancelModalItem(null)}
      />
    </AppLayout>
  );
}
