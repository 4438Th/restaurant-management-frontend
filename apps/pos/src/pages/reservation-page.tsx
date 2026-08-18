import { useState } from "react";
import { AppLayout } from "@/components/layouts";
import { Icon } from "@repo/ui";
import { useTable } from "@repo/shared-features/tables";
import { useDish } from "@repo/shared-features/menu";
import type { TableReservationResponse } from "@repo/shared-features/reservations";
import { DepositPaymentModal } from "@/features/payment";
import {
  ReservationToolbar,
  ReservationTable,
  ReservationCancelModal,
  ReservationFormModal,
  ReservationDetailModal,
  useReservationState,
  useFilters,
  useReservationActions,
} from "@/features/reservations";

export function ReservationPage() {
  const ui = useReservationState();
  const filters = useFilters();

  const [selectedDepositReservation, setSelectedDepositReservation] =
    useState<TableReservationResponse | null>(null);

  const actions = useReservationActions(() => {
    ui.closeFormModal();
  });

  const { data: tablesData } = useTable({ size: 100 });
  const { data: dishesData } = useDish({ size: 100 });

  const handleFormSubmit = () => {
    if (
      !ui.formData.tableId ||
      !ui.formData.customerName ||
      !ui.formData.customerPhone ||
      !ui.formData.reservationTime
    ) {
      return;
    }

    actions.handleFormSubmit(ui.formData, ui.preOrderItems, ui.editingItem);
  };

  return (
    <AppLayout title="Quản lý lịch đặt bàn">
      <div className="flex flex-col gap-4 h-full">
        <ReservationToolbar
          searchQuery={filters.searchQuery}
          selectedStatus={filters.selectedStatus}
          onSearchChange={filters.setSearchQuery}
          onStatusChange={filters.setSelectedStatus}
          onCreateNew={() => ui.openCreateModal(tablesData?.data?.[0]?.id)}
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex flex-col shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ReservationTable
              reservations={filters.reservations}
              isLoading={filters.isLoading}
              isError={filters.isError}
              onRetry={filters.refetch}
              onPayDeposit={(item) => setSelectedDepositReservation(item)}
              onCheckIn={(item) => actions.handleCheckIn(item)}
              onViewDetails={ui.setDetailItem}
            />
          </div>

          {filters.pageData && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant shrink-0 bg-surface-container-lowest text-xs text-on-surface-variant">
              <button
                onClick={filters.resetCursor}
                disabled={!filters.filters.cursor}
                className="text-primary hover:underline font-medium disabled:no-underline disabled:text-on-surface-variant/50 cursor-pointer"
              >
                {filters.filters.cursor
                  ? "← Quay lại trang đầu"
                  : "Đang ở trang đầu"}
              </button>
              <button
                disabled={!filters.pageData.hasNext || filters.isLoading}
                onClick={filters.loadNextPage}
                className="px-3 py-1.5 rounded-lg border flex items-center gap-1 hover:bg-surface-container disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
              >
                Trang tiếp theo <Icon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ReservationDetailModal
        item={ui.detailItem}
        onClose={() => ui.setDetailItem(null)}
        onEdit={(item) => {
          ui.setDetailItem(null);
          ui.openEditModal(item);
        }}
        onRequestCancel={ui.setCancelModalItem}
      />

      <ReservationFormModal
        isOpen={ui.isFormOpen}
        currentStep={ui.currentStep}
        tables={tablesData?.data || []}
        dishes={dishesData?.data || []}
        isEditMode={Boolean(ui.editingItem)}
        isSubmitting={actions.isFormPending}
        formData={ui.formData}
        preOrderItems={ui.preOrderItems}
        onChangeStep={ui.setCurrentStep}
        onChangeForm={ui.handleFormChange}
        onAddToCart={ui.handleAddToCart}
        onUpdateQuantity={ui.handleUpdateQuantity}
        onRemoveItem={ui.handleRemoveItem}
        onClose={ui.closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <ReservationCancelModal
        item={ui.cancelModalItem}
        reason={ui.cancelReason}
        isSubmitting={actions.isCancelPending}
        onReasonChange={ui.setCancelReason}
        onConfirm={() => {
          if (ui.cancelModalItem) {
            actions.handleCancel(ui.cancelModalItem.id, ui.cancelReason);
            ui.setCancelModalItem(null);
            ui.setCancelReason("");
          }
        }}
        onClose={() => ui.setCancelModalItem(null)}
      />

      {/* Modal Thu Tiền Cọc */}
      {selectedDepositReservation && (
        <DepositPaymentModal
          isOpen={Boolean(selectedDepositReservation)}
          onClose={() => setSelectedDepositReservation(null)}
          reservation={selectedDepositReservation}
          depositAmount={
            selectedDepositReservation.depositAmount
              ? Number(selectedDepositReservation.depositAmount)
              : 0
          }
          onSuccess={() => {
            filters.refetch();
          }}
        />
      )}
    </AppLayout>
  );
}
