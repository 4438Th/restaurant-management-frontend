import type { TableReservationResponse } from "@repo/shared-features/reservations";

interface ReservationCancelModalProps {
  item: TableReservationResponse | null;
  reason: string;
  isSubmitting: boolean;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function ReservationCancelModal({
  item,
  reason,
  isSubmitting,
  onReasonChange,
  onConfirm,
  onClose,
}: ReservationCancelModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant w-full max-w-md gap-4 flex flex-col">
        <h3 className="text-lg font-semibold text-on-surface">
          Hủy lịch đặt bàn
        </h3>
        <p className="text-sm text-on-surface-variant">
          Xác nhận hủy lịch của khách <b>{item.customerName}</b> (
          {item.tableName})?
        </p>
        <textarea
          placeholder="Nhập lý do hủy..."
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="w-full p-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary h-24"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-outline-variant text-sm font-medium rounded-xl hover:bg-surface-container"
          >
            Đóng
          </button>
          <button
            onClick={onConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="px-4 py-2 bg-error text-on-error text-sm font-semibold rounded-xl disabled:opacity-50"
          >
            Xác nhận Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
