import type { PaymentOrderDetail } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetail: PaymentOrderDetail | null;
  totalAmount: number;
  cashReceived: number;
  onCashChange: (value: number) => void;
  changeAmount: number;
  cashSuggestions: number[];
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderDetail,
  totalAmount,
  cashReceived,
  onCashChange,
  changeAmount,
  cashSuggestions,
  onConfirm,
  isSubmitting,
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-surface border border-outline-variant rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-lowest">
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Thanh toán Tiền mặt
            </h3>
            {orderDetail?.id && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                Mã đơn: #{orderDetail.id.slice(-4).toUpperCase()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition cursor-pointer"
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
              onChange={(e) => onCashChange(Number(e.target.value))}
              placeholder="Nhập số tiền..."
              className="w-full px-4 py-2.5 border border-outline-variant rounded-xl text-lg font-bold bg-surface focus:outline-none focus:border-primary"
            />

            {/* Gợi ý mệnh giá tiền */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {cashSuggestions.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onCashChange(amount)}
                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant rounded-lg text-xs font-semibold text-on-surface transition cursor-pointer"
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
            className="flex-1 py-3 border border-outline-variant rounded-2xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting || cashReceived < totalAmount}
            onClick={onConfirm}
            className="flex-1 py-3 bg-primary text-on-primary rounded-2xl text-xs font-bold hover:bg-primary/90 transition disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}
