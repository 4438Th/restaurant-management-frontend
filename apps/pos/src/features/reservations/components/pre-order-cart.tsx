import React from "react";
import { Icon } from "@repo/ui";
import type { DishResponse } from "@repo/shared-features/menu";

export interface PreOrderItem {
  dish: DishResponse;
  quantity: number;
  note?: string;
}

interface PreOrderCartProps {
  items: PreOrderItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
}

export const PreOrderCart: React.FC<PreOrderCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.dish.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col h-full bg-surface border border-outline-variant rounded-2xl p-4 select-none">
      <h4 className="text-base font-bold text-on-surface mb-3 flex items-center justify-between">
        <span>Món đã chọn</span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          {items.reduce((acc, curr) => acc + curr.quantity, 0)} món
        </span>
      </h4>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-70 max-h-100">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant text-sm py-12">
            <Icon name="Utensils" className="w-8 h-8 opacity-40 mb-2" />
            <span>Chưa chọn món đặt trước</span>
          </div>
        ) : (
          items.map((item) => {
            const price = parseFloat(item.dish.price) || 0;
            return (
              <div
                key={item.dish.id}
                className="flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <div className="text-sm font-semibold text-on-surface truncate">
                    {item.dish.dishName}
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {price.toLocaleString("vi-VN")} đ
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-outline-variant rounded-lg bg-surface">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, -1)}
                      className="p-1 text-on-surface-variant hover:text-on-surface"
                    >
                      <Icon name="Minus" className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-on-surface">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.dish.id, 1)}
                      className="p-1 text-on-surface-variant hover:text-on-surface"
                    >
                      <Icon name="Plus" className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.dish.id)}
                    className="p-1 text-error hover:bg-error/10 rounded-lg transition"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Total */}
      <div className="pt-3 border-t border-outline-variant/60 mt-auto">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-on-surface">Tạm tính:</span>
          <span className="text-primary text-base">
            {subtotal.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>
    </div>
  );
};
