import { Icon, type IconName } from "@repo/ui";
import {
  TableReservationStatus,
  TableReservationStatusLabel,
  type TableReservationResponse,
} from "@repo/shared-features/reservations";

const STATUS_CONFIG: Record<
  TableReservationStatus,
  { style: string; icon: IconName }
> = {
  [TableReservationStatus.PENDING]: {
    style:
      "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400",
    icon: "Clock",
  },
  [TableReservationStatus.CONFIRMED]: {
    style: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
    icon: "CalendarCheck",
  },
  [TableReservationStatus.ARRIVED]: {
    style:
      "bg-indigo-500/10 text-indigo-600 border-indigo-500/30 dark:text-indigo-400 font-bold",
    icon: "MapPin",
  },
  [TableReservationStatus.COMPLETED]: {
    style:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    icon: "CheckCircle2",
  },
  [TableReservationStatus.NO_SHOW]: {
    style: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
    icon: "UserX",
  },
  [TableReservationStatus.CANCELLED]: {
    style:
      "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400",
    icon: "XCircle",
  },
};

export interface ReservationTableRowProps {
  item: TableReservationResponse;
  onCheckIn: (item: TableReservationResponse) => void;
  onPayDeposit: (item: TableReservationResponse) => void;
  onViewDetails: (item: TableReservationResponse) => void;
}

export function ReservationTableRow({
  item,
  onCheckIn,
  onPayDeposit,
  onViewDetails,
}: ReservationTableRowProps) {
  const statusInfo = STATUS_CONFIG[item.status];

  return (
    <tr
      onClick={() => onViewDetails(item)}
      className="hover:bg-surface-container-low/50 cursor-pointer transition-colors"
    >
      <td className="p-4">
        <div className="font-semibold text-on-surface">{item.customerName}</div>
        <div className="text-xs text-on-surface-variant">
          {item.customerPhone}
        </div>
      </td>

      <td className="p-4">
        <div className="font-medium text-on-surface">{item.tableName}</div>
        <div className="text-xs text-on-surface-variant">{item.tableArea}</div>
      </td>

      <td className="p-4 font-medium">{item.guestCount} người</td>

      <td className="p-4">
        {new Date(item.reservationTime).toLocaleString("vi-VN", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </td>

      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs ${statusInfo.style}`}
        >
          <Icon name={statusInfo.icon} className="w-3 h-3 shrink-0" />
          {TableReservationStatusLabel[item.status]}
        </span>
      </td>

      <td className="p-4 font-semibold text-primary">
        {item.depositAmount
          ? `${item.depositAmount.toLocaleString("vi-VN")} đ`
          : "0 đ"}
      </td>

      <td className="p-4 text-xs text-on-surface-variant max-w-xs truncate">
        {item.note || "-"}
      </td>

      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1.5">
          {item.status === TableReservationStatus.PENDING && (
            <button
              type="button"
              onClick={() => onPayDeposit(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-amber-700 active:scale-95 transition-all"
              title="Thu tiền cọc"
            >
              <Icon name="CreditCard" className="w-3.5 h-3.5" />
              Thu cọc
            </button>
          )}

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

          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors border border-transparent hover:border-outline-variant/30"
            title="Xem chi tiết"
          >
            <Icon name="Eye" className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
