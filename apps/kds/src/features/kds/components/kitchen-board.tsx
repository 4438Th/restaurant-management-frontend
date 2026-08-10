import { type OrderItemResponse, OrderItemStatus } from "@repo/shared-features";
import { Icon } from "@repo/ui";
import { KitchenItemCard } from "./kitchen-item-card";

interface KitchenBoardProps {
  items: OrderItemResponse[];
  isLoading: boolean;
  onUpdateStatus: (
    itemId: string,
    newStatus: OrderItemStatus,
    orderId?: string,
  ) => void;
  isUpdating: boolean;
}

export function KitchenBoard({
  items,
  isLoading,
  onUpdateStatus,
  isUpdating,
}: KitchenBoardProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 font-medium py-32 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm">Đang đồng bộ dữ liệu nhà bếp...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-white/60 py-32">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-1">
          <Icon name="ChefHat" className="w-8 h-8" />
        </div>
        <span className="text-sm font-medium text-slate-500">
          Không tìm thấy món ăn nào phù hợp với điều kiện hiển thị.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
        {items.map((item) => (
          <KitchenItemCard
            key={item.id}
            item={item}
            onUpdateStatus={onUpdateStatus}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
}
