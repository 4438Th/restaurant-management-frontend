import { Badge } from "@repo/ui";
import {
  OrderItemStatus,
  type OrderItemResponse,
} from "@repo/shared-features/order";

interface ExistingOrderItemRowProps {
  item: OrderItemResponse;
}

const STATUS_CONFIG: Record<
  OrderItemStatus,
  { label: string; className: string }
> = {
  [OrderItemStatus.PENDING]: {
    label: "Chờ tiếp nhận",
    className: "bg-amber-100 text-amber-800 border-amber-300",
  },
  [OrderItemStatus.PREPARING]: {
    label: "Đang chuẩn bị",
    className: "bg-orange-100 text-orange-800 border-orange-300",
  },
  [OrderItemStatus.READY]: {
    label: "Chờ ra món",
    className: "bg-blue-100 text-blue-800 border-blue-300 animate-pulse",
  },
  [OrderItemStatus.SERVED]: {
    label: "Đã ra món",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  [OrderItemStatus.CANCELLED]: {
    label: "Bị từ chối",
    className: "bg-rose-100 text-rose-800 border-rose-300",
  },
  [OrderItemStatus.REFUNDED]: {
    label: "Đã hoàn tiền",
    className: "bg-slate-100 text-slate-800 border-slate-300",
  },
};

export function ExistingOrderItemRow({ item }: ExistingOrderItemRowProps) {
  const statusInfo = STATUS_CONFIG[item.status] || {
    label: item.status || "Chờ xử lý",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const priceNum = Number(item.price) || 0;
  const totalPrice = item.totalPrice
    ? Number(item.totalPrice)
    : priceNum * item.quantity;

  return (
    <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-sm text-on-surface line-clamp-1 flex-1">
          {item.dishName}
        </p>
        <span className="text-xs font-bold text-on-surface-variant shrink-0">
          x{item.quantity}
        </span>
      </div>

      {item.note && (
        <p className="text-[11px] text-on-surface-variant italic line-clamp-1">
          * {item.note}
        </p>
      )}

      <div className="flex items-center justify-between text-xs pt-0.5">
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0.2 font-normal border ${statusInfo.className}`}
        >
          {statusInfo.label}
        </Badge>
        <span className="font-semibold text-on-surface">
          {totalPrice.toLocaleString("vi-VN")} đ
        </span>
      </div>
    </div>
  );
}
