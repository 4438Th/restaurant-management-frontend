import {
  type OrderItemResponse,
  OrderItemStatus,
  OrderItemStatusLabel,
} from "@repo/shared-features";

const statusColors: Record<OrderItemStatus, string> = {
  [OrderItemStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
  [OrderItemStatus.PREPARING]: "bg-sky-50 text-sky-700 border-sky-200",
  [OrderItemStatus.READY]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [OrderItemStatus.SERVED]: "bg-slate-100 text-slate-700 border-slate-200",
  [OrderItemStatus.CANCELLED]: "bg-rose-50 text-rose-700 border-rose-200",
  [OrderItemStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

interface KitchenItemCardProps {
  item: OrderItemResponse;
  onUpdateStatus: (
    itemId: string,
    newStatus: OrderItemStatus,
    orderId?: string,
  ) => void;
  isUpdating: boolean;
}

export function KitchenItemCard({
  item,
  onUpdateStatus,
  isUpdating,
}: KitchenItemCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between gap-4 transition hover:border-slate-300 hover:shadow-md">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="text-sm font-bold text-slate-900 tracking-wide">
            <span className="text-indigo-600 font-extrabold mr-1.5">
              {item.quantity}x
            </span>
            {item.dishName}
          </span>
          <span
            className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${statusColors[item.status]}`}
          >
            {OrderItemStatusLabel[item.status]}
          </span>
        </div>

        {item.note && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-rose-700 text-xs font-medium mb-2">
            ⚠️ Ghi chú: {item.note}
          </div>
        )}

        <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
          <span>
            Mã đơn:{" "}
            <strong className="text-slate-800 font-mono">
              #{item.orderId.substring(0, 8)}
            </strong>
          </span>
          <span>
            Cập nhật:{" "}
            {new Date(
              item.updatedAt || item.createdAt || "1970-01-01T00:00:00Z",
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Cụm nút thao tác chuyển trạng thái */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
        {item.status === OrderItemStatus.PENDING && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              onUpdateStatus(item.id, OrderItemStatus.PREPARING, item.orderId)
            }
            className="col-span-2 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-sm shadow-sky-600/20 disabled:opacity-50 cursor-pointer"
          >
            Nhận chế biến
          </button>
        )}
        {item.status === OrderItemStatus.PREPARING && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              onUpdateStatus(item.id, OrderItemStatus.READY, item.orderId)
            }
            className="col-span-2 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            Chế biến xong
          </button>
        )}
        {item.status === OrderItemStatus.READY && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              onUpdateStatus(item.id, OrderItemStatus.SERVED, item.orderId)
            }
            className="col-span-2 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
          >
            Đã phục vụ
          </button>
        )}
        {item.status !== OrderItemStatus.SERVED &&
          item.status !== OrderItemStatus.CANCELLED && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onUpdateStatus(item.id, OrderItemStatus.CANCELLED, item.orderId)
              }
              className="col-span-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs transition border border-rose-200 disabled:opacity-50 cursor-pointer"
            >
              Hủy món
            </button>
          )}
      </div>
    </div>
  );
}
