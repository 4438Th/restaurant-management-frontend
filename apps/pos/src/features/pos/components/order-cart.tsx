import { type CartItem } from "../types";

interface OrderCartProps {
  cart: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onCheckout: () => void;
}

export function OrderCart({
  cart,
  onUpdateQuantity,
  onCheckout,
}: OrderCartProps) {
  const totalAmount = cart.reduce((sum, item) => {
    const priceNum = parseFloat(item.dish.price) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col h-full bg-surface border-l border-outline-variant w-80 shrink-0 p-4">
      <h2 className="text-lg font-bold text-on-surface mb-4">Đơn hàng POS</h2>

      {/* Cart List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {cart.length === 0 ? (
          <div className="text-center text-on-surface-variant text-sm mt-12">
            Chưa có món nào được chọn
          </div>
        ) : (
          cart.map((item) => {
            const priceNum = parseFloat(item.dish.price) || 0;
            return (
              <div
                key={item.dish.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant"
              >
                <div className="flex-1 pr-2">
                  <p className="font-medium text-sm text-on-surface line-clamp-1">
                    {item.dish.dishName}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-0.5">
                    {(priceNum * item.quantity).toLocaleString("vi-VN")} đ
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.dish.id, -1)}
                    className="w-6 h-6 rounded-full bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface text-sm transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.dish.id, 1)}
                    className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm transition"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Footer */}
      <div className="pt-4 border-t border-outline-variant mt-auto space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-on-surface-variant">Tổng món:</span>
          <span className="font-semibold text-on-surface">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </div>
        <div className="flex justify-between items-center text-base font-bold">
          <span className="text-on-surface">Tổng tiền:</span>
          <span className="text-primary text-xl">
            {totalAmount.toLocaleString("vi-VN")} đ
          </span>
        </div>
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={onCheckout}
          className="w-full py-3 bg-primary text-on-primary font-semibold rounded-full hover:bg-primary-container transition disabled:opacity-50"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
