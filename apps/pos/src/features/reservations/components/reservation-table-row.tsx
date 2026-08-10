import { Icon } from "@repo/ui";
import {
  TableReservationStatus,
  TableReservationStatusLabel,
  type TableReservationResponse,
} from "@repo/shared-features/reservations";

const STATUS_STYLES: Record<TableReservationStatus, string> = {
  [TableReservationStatus.PENDING]:
    "bg-warning/10 text-warning border-warning/20",
  [TableReservationStatus.CONFIRMED]: "bg-info/10 text-info border-info/20",
  [TableReservationStatus.ARRIVED]:
    "bg-primary/10 text-primary border-primary/20",
  [TableReservationStatus.COMPLETED]:
    "bg-success/10 text-success border-success/20",
  [TableReservationStatus.CANCELLED]:
    "bg-outline/10 text-on-surface-variant border-outline/20",
  [TableReservationStatus.DELAYED]: "bg-error/10 text-error border-error/20",
  [TableReservationStatus.NO_SHOW]: "bg-error/20 text-error border-error/40",
};

export interface ReservationTableRowProps {
  item: TableReservationResponse;
  onConfirm: (id: string) => void;
  onArrive: (item: TableReservationResponse) => void;
  onComplete: (id: string) => void;
  onNoShow: (id: string) => void;
  onRequestCancel: (item: TableReservationResponse) => void;
  onEdit: (item: TableReservationResponse) => void;
}

export function ReservationTableRow({
  item,
  onConfirm,
  onArrive,
  onComplete,
  onNoShow,
  onRequestCancel,
  onEdit,
}: ReservationTableRowProps) {
  // Chỉ hiển thị nút Xác nhận khi trạng thái là PENDING (chờ duyệt)
  const isPending = item.status === TableReservationStatus.PENDING;

  // Nút Khách đến hiển thị khi đã được CONFIRMED hoặc PENDING (hoặc tùy theo logic hệ thống của bạn)
  const isPendingOrConfirmed =
    item.status === TableReservationStatus.CONFIRMED ||
    item.status === TableReservationStatus.PENDING;

  const isConfirmedOrDelayed =
    item.status === TableReservationStatus.CONFIRMED ||
    item.status === TableReservationStatus.DELAYED;

  const canCancel =
    item.status !== TableReservationStatus.COMPLETED &&
    item.status !== TableReservationStatus.CANCELLED;

  return (
    <tr className="hover:bg-surface-container-low/50">
      {/* Khách hàng */}
      <td className="p-4">
        <div className="font-semibold text-on-surface">{item.customerName}</div>
        <div className="text-xs text-on-surface-variant">
          {item.customerPhone}
        </div>
      </td>

      {/* Bàn & Khu vực */}
      <td className="p-4">
        <div className="font-medium text-on-surface">{item.tableName}</div>
        <div className="text-xs text-on-surface-variant">{item.tableArea}</div>
      </td>

      {/* Số khách */}
      <td className="p-4 font-medium">{item.guestCount} người</td>

      {/* Thời gian nhận bàn */}
      <td className="p-4">
        {new Date(item.reservationTime).toLocaleString("vi-VN", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </td>

      {/* Trạng thái */}
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
            STATUS_STYLES[item.status]
          }`}
        >
          {TableReservationStatusLabel[item.status]}
        </span>
      </td>

      {/* Ghi chú */}
      <td className="p-4 text-xs text-on-surface-variant max-w-xs truncate">
        {item.note || "-"}
      </td>

      {/* Thao tác */}
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Nút Phê duyệt / Xác nhận đơn đặt bàn (PENDING) */}
          {isPending && (
            <button
              type="button"
              onClick={() => onConfirm(item.id)}
              className="px-2.5 py-1.5 bg-info text-on-info text-xs font-semibold rounded-lg hover:opacity-90"
            >
              Xác nhận
            </button>
          )}

          {isPendingOrConfirmed && (
            <button
              type="button"
              onClick={() => onArrive(item)}
              className="px-2.5 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:opacity-90"
            >
              Khách đến
            </button>
          )}

          {item.status === TableReservationStatus.ARRIVED && (
            <button
              type="button"
              onClick={() => onComplete(item.id)}
              className="px-2.5 py-1.5 bg-success text-on-success text-xs font-semibold rounded-lg hover:opacity-90"
            >
              Hoàn tất
            </button>
          )}

          {isConfirmedOrDelayed && (
            <button
              type="button"
              onClick={() => onNoShow(item.id)}
              className="px-2.5 py-1.5 bg-surface-container text-error text-xs font-semibold rounded-lg border border-outline-variant hover:bg-error/10"
            >
              Khách vắng
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => onRequestCancel(item)}
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg"
              title="Hủy đặt bàn"
            >
              <Icon name="XCircle" className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg"
            title="Chỉnh sửa thông tin"
          >
            <Icon name="Edit" className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
