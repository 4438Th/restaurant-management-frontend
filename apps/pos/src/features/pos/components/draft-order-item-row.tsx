import { type CartItem } from "../types";

interface DraftOrderItemRowProps {
  item: CartItem;
  onUpdateQuantity: (dishId: string, delta: number) => void;
}

export function DraftOrderItemRow({
  item,
  onUpdateQuantity,
}: DraftOrderItemRowProps) {
  const priceNum = Number(item.dish.price) || 0;

  return (
    <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-on-surface line-clamp-1">
          {item.dish.dishName}
        </p>
        <p className="text-xs text-primary font-bold">
          {(priceNum * item.quantity).toLocaleString("vi-VN")} đ
        </p>
      </div>

      {item.note && (
        <p className="text-[11px] text-on-surface-variant italic">
          * {item.note}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-on-surface-variant">
          {priceNum.toLocaleString("vi-VN")} đ
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.dish.id, -1)}
            className="w-6 h-6 rounded-lg bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-xs font-bold transition"
          >
            -
          </button>
          <span className="text-xs font-bold w-4 text-center">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.dish.id, 1)}
            className="w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center text-xs font-bold transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
