// apps/pos/src/features/pos/components/order-cart.tsx

import { Icon } from "@repo/ui";
import { type OrderItemResponse } from "@repo/shared-features/order";
import { type CartItem } from "../types";
import { ExistingOrderItemRow } from "./existing-order-item-row";
import { DraftOrderItemRow } from "./draft-order-item-row";
import { useOrderCart } from "../hooks/use-order-cart";

export interface OrderCartProps {
  cart: CartItem[];
  existingItems?: OrderItemResponse[];
  isSubmitting?: boolean;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onSendToKitchen?: () => void;
  onCheckout: () => void;
}

export function OrderCart({
  cart = [],
  existingItems = [],
  isSubmitting = false,
  onUpdateQuantity,
  onSendToKitchen,
  onCheckout,
}: OrderCartProps) {
  const { grandTotal, totalItemCount, isReadyForCheckout } = useOrderCart(
    cart,
    existingItems,
  );

  return (
    <div className="flex flex-col h-full bg-surface border-l border-outline-variant w-80 shrink-0 p-4 select-none">
      <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center justify-between">
        <span>Chi tiết đơn hàng</span>
        {totalItemCount > 0 && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {totalItemCount} món
          </span>
        )}
      </h2>

      {/* Cart Items List Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {cart.length === 0 && existingItems.length === 0 ? (
          <div className="text-center text-on-surface-variant text-sm mt-12">
            Chưa có món nào trong đơn
          </div>
        ) : (
          <>
            {/* KHỐI 1: MÓN MỚI CHỌN (CHỜ GỬI CHẾ BIẾN) */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Món mới chọn ({cart.length})
                </div>

                {cart.map((item) => (
                  <DraftOrderItemRow
                    key={item.dish.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>
            )}

            {/* KHỐI 2: MÓN ĐÃ GỬI CHẾ BIẾN (BẾP / BAR) */}
            {existingItems.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                  <span>Đã gửi chế biến ({existingItems.length})</span>
                </div>

                <div className="space-y-2">
                  {existingItems.map((item) => (
                    <ExistingOrderItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER ACTION PANEL */}
      <div className="pt-4 border-t border-outline-variant mt-auto space-y-3 shrink-0">
        <div className="flex justify-between items-center text-base font-bold">
          <span className="text-on-surface">Tổng tiền đơn:</span>
          <span className="text-primary text-xl">
            {grandTotal.toLocaleString("vi-VN")} đ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Nút Gửi Chế Biến */}
          <button
            type="button"
            disabled={cart.length === 0 || isSubmitting}
            onClick={onSendToKitchen}
            className="py-2.5 px-3 bg-secondary text-on-secondary text-xs font-bold rounded-xl hover:bg-secondary/90 transition disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Icon name="Send" className="w-3.5 h-3.5 shrink-0" />
            <span>{isSubmitting ? "Đang gửi..." : "Gửi chế biến"}</span>
          </button>

          {/* Nút Thanh Toán */}
          <button
            type="button"
            disabled={!isReadyForCheckout || cart.length > 0 || isSubmitting}
            onClick={onCheckout}
            title={
              !isReadyForCheckout
                ? "Toàn bộ món phải ở trạng thái Đã ra món hoặc Bị từ chối mới có thể thanh toán"
                : ""
            }
            className="py-2.5 px-3 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Icon name="Receipt" className="w-3.5 h-3.5 shrink-0" />
            <span>Thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  );
}
