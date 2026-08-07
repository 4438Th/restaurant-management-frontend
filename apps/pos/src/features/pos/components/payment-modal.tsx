import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useCheckoutOrder } from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import type { OrderItemResponse } from "./order-cart";
import type { CartItem } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetail?: {
    id: string;
    orderDetails?: OrderItemResponse[];
  } | null;
  cart?: CartItem[];
  onSuccess?: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderDetail,
  cart = [],
  onSuccess,
}: PaymentModalProps) {
  const clearCart = usePosStore((state) => state.clearCart);
  const setActiveOrder = usePosStore((state) => state.setActiveOrder);

  // Hook checkout API từ Shared Features
  const checkoutMutation = useCheckoutOrder();

  // State nhập số tiền khách đưa
  const [cashReceived, setCashReceived] = useState<number>(0);

  // TÍNH TỔNG TIỀN ĐƠN HÀNG (Món đã gọi + Món nháp trong cart nếu có)
  const totalAmount = useMemo(() => {
    const existingTotal =
      orderDetail?.orderDetails?.reduce((sum, item) => {
        return sum + (parseFloat(item.price) || 0) * item.quantity;
      }, 0) || 0;

    const draftTotal = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.dish.price) || 0) * item.quantity;
    }, 0);

    return existingTotal + draftTotal;
  }, [orderDetail, cart]);

  // Tiền thừa trả khách
  const changeAmount = Math.max(0, cashReceived - totalAmount);

  // Gợi ý nhanh các mệnh giá tiền phổ biến
  const cashSuggestions = useMemo(() => {
    if (totalAmount <= 0) return [];
    const base = [totalAmount];
    const denominations = [50000, 100000, 200000, 500000];
    denominations.forEach((d) => {
      if (d > totalAmount && !base.includes(d)) {
        base.push(d);
      }
    });
    return base.sort((a, b) => a - b).slice(0, 4);
  }, [totalAmount]);

  if (!isOpen) return null;

  // XỬ LÝ THANH TOÁN
  const handleConfirmPayment = async () => {
    if (!orderDetail?.id) {
      toast.error("Không tìm thấy thông tin đơn hàng!");
      return;
    }

    if (cashReceived < totalAmount) {
      toast.error("Số tiền nhận chưa đủ tổng giá trị đơn hàng!");
      return;
    }

    try {
      await checkoutMutation.mutateAsync(orderDetail.id);

      toast.success("Thanh toán thành công!");
      clearCart();
      setActiveOrder(null);
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-surface border border-outline-variant rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-lowest">
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Thanh toán Tiền mặt
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Mã đơn: #{orderDetail?.id.slice(-4).toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* TỔNG TIỀN CẦN THU */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Tổng tiền cần thanh toán
            </span>
            <div className="text-3xl font-black text-primary">
              {totalAmount.toLocaleString("vi-VN")} đ
            </div>
          </div>

          {/* Ô NHẬP TIỀN KHÁCH ĐƯA */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Tiền khách đưa
            </label>
            <input
              type="number"
              value={cashReceived || ""}
              onChange={(e) => setCashReceived(Number(e.target.value))}
              placeholder="Nhập số tiền..."
              className="w-full px-4 py-2.5 border border-outline-variant rounded-xl text-lg font-bold bg-surface focus:outline-none focus:border-primary"
            />

            {/* Gợi ý mệnh giá tiền */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {cashSuggestions.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setCashReceived(amount)}
                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant rounded-lg text-xs font-semibold text-on-surface transition"
                >
                  {amount.toLocaleString("vi-VN")} đ
                </button>
              ))}
            </div>
          </div>

          {/* HIỂN THỊ TIỀN THỪA */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm">
            <span className="text-on-surface-variant font-medium">
              Tiền thừa trả khách:
            </span>
            <span className="font-bold text-on-surface">
              {changeAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-outline-variant rounded-2xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={checkoutMutation.isPending || cashReceived < totalAmount}
            onClick={handleConfirmPayment}
            className="flex-1 py-3 bg-primary text-on-primary rounded-2xl text-xs font-bold hover:bg-primary/90 transition disabled:opacity-40"
          >
            {checkoutMutation.isPending
              ? "Đang xử lý..."
              : "Xác nhận Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}
