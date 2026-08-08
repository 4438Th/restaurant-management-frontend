import type { OrderItemResponse } from "@repo/shared-features/order";
import { type CartItem } from "../types";

export type { OrderItemResponse };

export interface OrderCartProps {
  /** Danh sách món mới chọn (Chưa gửi bếp) */
  cart: CartItem[];
  /** Danh sách món đã được lưu trên Server/Bếp của Order hiện tại */
  existingItems?: OrderItemResponse[];
  /** Trạng thái loading/submitting */
  isSubmitting?: boolean;
  /** Callbacks cho món nháp */
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onSendToKitchen?: () => void;
  /** Callback thanh toán */
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
  // Tính tổng tiền món nháp
  const draftTotal = cart.reduce((sum, item) => {
    const priceNum = Number(item.dish.price) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  // Tính tổng tiền món đã gọi
  const existingTotal = existingItems.reduce((sum, item) => {
    const priceNum = Number(item.price) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  const grandTotal = draftTotal + existingTotal;
  const totalItemCount =
    cart.reduce((sum, item) => sum + item.quantity, 0) +
    existingItems.reduce((sum, item) => sum + item.quantity, 0);

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
            {/* SECTION 1: MÓN MỚI CHỌN (CHỜ GỬI BẾP) */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Món mới chọn ({cart.length})
                </div>

                {cart.map((item) => {
                  const priceNum = Number(item.dish.price) || 0;
                  return (
                    <div
                      key={item.dish.id}
                      className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5"
                    >
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
                })}
              </div>
            )}

            {/* SECTION 2: MÓN ĐÃ GỌI XUỐNG BẾP */}
            {existingItems.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Món đã gửi bếp ({existingItems.length})
                </div>

                {existingItems.map((item) => {
                  const priceNum = Number(item.price) || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-1 opacity-90"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-on-surface line-clamp-1">
                          {item.dishName}
                        </p>
                        <span className="text-xs font-bold text-on-surface-variant">
                          x{item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-medium">
                          {item.status || "Đã gửi bếp"}
                        </span>
                        <span className="font-semibold text-on-surface-variant">
                          {(priceNum * item.quantity).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  );
                })}
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
          {/* Nút Gửi Bếp */}
          <button
            type="button"
            disabled={cart.length === 0 || isSubmitting}
            onClick={onSendToKitchen}
            className="py-2.5 px-3 bg-secondary text-on-secondary text-xs font-bold rounded-xl hover:bg-secondary/90 transition disabled:opacity-40 flex items-center justify-center gap-1"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bếp"}
          </button>

          {/* Nút Thanh Toán */}
          <button
            type="button"
            disabled={existingItems.length === 0 && cart.length === 0}
            onClick={onCheckout}
            className="py-2.5 px-3 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary/90 transition disabled:opacity-40 flex items-center justify-center gap-1"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
