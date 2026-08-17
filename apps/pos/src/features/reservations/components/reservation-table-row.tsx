import { Icon, type IconName } from "@repo/ui";
import {
  TableReservationStatus,
  TableReservationStatusLabel,
  type TableReservationResponse,
} from "@repo/shared-features/reservations";

// Cấu hình style & icon badge cho từng trạng thái
const STATUS_CONFIG: Record<
  TableReservationStatus,
  { style: string; icon: IconName }
> = {
  // Chờ duyệt: Vàng Cam (Chờ xử lý)
  [TableReservationStatus.PENDING]: {
    style:
      "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400",
    icon: "Clock",
  },
  // Đã xác nhận: Xanh Dương (Sẵn sàng đón khách)
  [TableReservationStatus.CONFIRMED]: {
    style: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
    icon: "CalendarCheck",
  },
  // Khách đã đến: Tím/Indigo (Đang ngồi tại bàn)
  [TableReservationStatus.ARRIVED]: {
    style:
      "bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400 font-bold",
    icon: "MapPin",
  },
  // Hoàn tất: Xanh Lá (Đã xong dịch vụ)
  [TableReservationStatus.COMPLETED]: {
    style:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    icon: "CheckCircle2",
  },
  // Khách vắng mặt: Đỏ Thẫm (Không đến)
  [TableReservationStatus.NO_SHOW]: {
    style: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
    icon: "UserX",
  },
  // Đã hủy: Xám Trung Tính (Nền chìm)
  [TableReservationStatus.CANCELLED]: {
    style:
      "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400",
    icon: "XCircle",
  },
};

export interface ReservationTableRowProps {
  item: TableReservationResponse;
  onConfirm: (id: string) => void;
  onCheckIn: (item: TableReservationResponse) => void;
  onViewDetails: (item: TableReservationResponse) => void;
}

export function ReservationTableRow({
  item,
  onConfirm,
  onCheckIn,
  onViewDetails,
}: ReservationTableRowProps) {
  const statusInfo = STATUS_CONFIG[item.status];

  return (
    <tr
      onClick={() => onViewDetails(item)}
      className="hover:bg-surface-container-low/50 cursor-pointer transition-colors"
    >
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
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs ${statusInfo.style}`}
        >
          <Icon name={statusInfo.icon} className="w-3 h-3 shrink-0" />
          {TableReservationStatusLabel[item.status]}
        </span>
      </td>

      {/* Ghi chú */}
      <td className="p-4 text-xs text-on-surface-variant max-w-xs truncate">
        {item.note || "-"}
      </td>

      {/* Thao tác cốt lõi */}
      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1.5">
          {/* Nút Xác nhận cho PENDING */}
          {item.status === TableReservationStatus.PENDING && (
            <button
              type="button"
              onClick={() => onConfirm(item.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Icon name="Check" className="w-3.5 h-3.5" />
              Xác nhận
            </button>
          )}

          {/* Nút Khách đến cho CONFIRMED */}
          {item.status === TableReservationStatus.CONFIRMED && (
            <button
              type="button"
              onClick={() => onCheckIn(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <Icon name="UserCheck" className="w-3.5 h-3.5" />
              Khách đến
            </button>
          )}

          {/* Nút Xem chi tiết */}
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors border border-transparent hover:border-outline-variant/30"
            title="Xem chi tiết & Thao tác khác"
          >
            <Icon name="Eye" className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
