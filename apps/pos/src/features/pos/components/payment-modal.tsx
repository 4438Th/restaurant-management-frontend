import { useState, useMemo } from "react";
import { Icon, type IconName } from "@repo/ui";
import {
  PaymentMethod,
  PaymentMethodLabel,
  TransactionType,
  useInvoiceByTarget,
  useProcessPaymentTransaction,
} from "@repo/shared-features/payment";
import type { PaymentOrderDetail } from "../types";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetail: PaymentOrderDetail | null;
  onSuccess?: () => void;
}

const CASH_SUGGESTIONS_BASE = [100000, 200000, 500000];

export function PaymentModal({
  isOpen,
  onClose,
  orderDetail,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [userCashInput, setUserCashInput] = useState<number | null>(null);
  const [externalRefNo, setExternalRefNo] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Fetch Invoice theo orderDetail.id tương tự Reservation Deposit
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoiceByTarget(
    orderDetail?.id ?? "",
    isOpen && Boolean(orderDetail?.id),
  );

  const targetInvoiceId = invoice?.id ?? "";

  const { mutate: processPayment, isPending } = useProcessPaymentTransaction();

  // Lấy số tiền cần trả từ Invoice (ưu tiên remainingAmount), nếu chưa có thì lấy từ orderDetail
  const rawAmount = invoice?.remainingAmount ?? orderDetail?.totalAmount ?? 0;
  const amountToPay = Number(rawAmount) || 0;

  const cashReceived = userCashInput ?? amountToPay;
  const changeAmount = Math.max(0, cashReceived - amountToPay);

  const cashSuggestions = useMemo(() => {
    if (!amountToPay) return CASH_SUGGESTIONS_BASE;
    const suggestions = new Set<number>();
    suggestions.add(amountToPay);
    CASH_SUGGESTIONS_BASE.forEach((val) => {
      if (val >= amountToPay) suggestions.add(val);
    });
    return Array.from(suggestions).sort((a, b) => a - b);
  }, [amountToPay]);

  if (!isOpen || !orderDetail) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetInvoiceId) {
      alert("Chưa tìm thấy hóa đơn cho đơn hàng này!");
      return;
    }

    if (amountToPay <= 0) return;

    processPayment(
      {
        invoiceId: targetInvoiceId,
        type: TransactionType.PAYMENT,
        amount: amountToPay,
        paymentMethod,
        externalRefNo:
          paymentMethod !== PaymentMethod.CASH
            ? externalRefNo.trim() || undefined
            : undefined,
        note:
          note.trim() ||
          `Thanh toán đơn hàng #${orderDetail.id.slice(-4).toUpperCase()}`,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  const paymentOptions = [
    {
      method: PaymentMethod.CASH,
      icon: "Banknote" as IconName,
      label: PaymentMethodLabel[PaymentMethod.CASH],
    },
    {
      method: PaymentMethod.BANK_TRANSFER,
      icon: "QrCode" as IconName,
      label: PaymentMethodLabel[PaymentMethod.BANK_TRANSFER],
    },
    {
      method: PaymentMethod.E_WALLET,
      icon: "Wallet" as IconName,
      label: PaymentMethodLabel[PaymentMethod.E_WALLET],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none animate-fadeIn">
      <div className="bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-surface-container-low/50">
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Thanh Toán Đơn Hàng
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Mã đơn: #{orderDetail.id.slice(-4).toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition cursor-pointer"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-5 flex-1 overflow-y-auto space-y-4"
        >
          {/* TỔNG TIỀN CẦN THU */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Tổng tiền cần thanh toán
            </span>
            <div className="text-3xl font-black text-primary">
              {isLoadingInvoice
                ? "Đang tải hóa đơn..."
                : `${amountToPay.toLocaleString("vi-VN")} đ`}
            </div>
            {invoice?.invoiceCode && (
              <span className="text-[11px] text-primary/80 mt-1 block">
                Mã HĐ: #{invoice.invoiceCode}
              </span>
            )}
          </div>

          {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-3 gap-2">
              {paymentOptions.map((item) => (
                <button
                  key={item.method}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(item.method);
                    if (item.method === PaymentMethod.CASH) {
                      setUserCashInput(amountToPay);
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === item.method
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-outline-variant/40 hover:bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  <span className="text-[11px] text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ô NHẬP TIỀN KHÁCH ĐƯA (CASH) */}
          {paymentMethod === PaymentMethod.CASH && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Tiền khách đưa
                </label>
                <input
                  type="number"
                  value={userCashInput ?? amountToPay ?? ""}
                  onChange={(e) =>
                    setUserCashInput(
                      e.target.value ? Number(e.target.value) : 0,
                    )
                  }
                  placeholder="Nhập số tiền..."
                  className="w-full px-4 py-2 border border-outline-variant/50 rounded-xl text-lg font-bold bg-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Gợi ý mệnh giá */}
              <div className="flex gap-1.5 flex-wrap">
                {cashSuggestions.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setUserCashInput(amount)}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant rounded-lg text-xs font-semibold text-on-surface transition cursor-pointer"
                  >
                    {amount.toLocaleString("vi-VN")} đ
                  </button>
                ))}
              </div>

              {/* TIỀN THỪA */}
              <div className="flex justify-between items-center text-sm pt-1 border-t border-outline-variant/40">
                <span className="text-on-surface-variant font-medium">
                  Tiền thừa trả khách:
                </span>
                <span className="font-bold text-on-surface">
                  {changeAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          )}

          {/* MÃ THAM CHIẾU KHI CHUYỂN KHOẢN/VÍ ĐIỆN TỬ */}
          {paymentMethod !== PaymentMethod.CASH && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Mã tham chiếu / Mã giao dịch
              </label>
              <input
                type="text"
                value={externalRefNo}
                onChange={(e) => setExternalRefNo(e.target.value)}
                placeholder="Ví dụ: FT240818xxxx, Momo123..."
                className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* GHI CHÚ */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Ghi chú
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thanh toán..."
              className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="pt-3 border-t border-outline-variant/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 border border-outline-variant/50 rounded-2xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={
                isPending ||
                isLoadingInvoice ||
                !targetInvoiceId ||
                amountToPay <= 0 ||
                (paymentMethod === PaymentMethod.CASH &&
                  cashReceived < amountToPay)
              }
              className="flex-1 py-3 bg-primary text-on-primary rounded-2xl text-xs font-bold hover:bg-primary/90 transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending && (
                <Icon name="Loader2" className="w-4 h-4 animate-spin" />
              )}
              {isPending ? "Đang xử lý..." : "Xác nhận Thanh toán"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
