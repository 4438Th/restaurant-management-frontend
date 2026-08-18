// deposit-payment-modal.tsx
import { useState, useMemo } from "react";
import { Icon, type IconName } from "@repo/ui";
import {
  PaymentMethod,
  PaymentMethodLabel,
  TransactionType,
  useInvoiceByTarget, // 👈 Import hook mới
  useProcessPaymentTransaction,
} from "@repo/shared-features/payment";
import type { TableReservationResponse } from "@repo/shared-features/reservations";

export interface DepositPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: TableReservationResponse;
  depositAmount?: number;
  onSuccess?: () => void;
}

const CASH_SUGGESTIONS_BASE = [100000, 200000, 500000];

export function DepositPaymentModal({
  isOpen,
  onClose,
  reservation,
  depositAmount = 0,
  onSuccess,
}: DepositPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH,
  );
  const [userCashInput, setUserCashInput] = useState<number | null>(null);
  const [externalRefNo, setExternalRefNo] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // 🔴 Lấy Invoice trực tiếp dựa trên reservation.id (targetId)
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoiceByTarget(
    reservation?.id ?? "",
    isOpen && Boolean(reservation?.id),
  );

  const targetInvoiceId = invoice?.id ?? "";

  // Hook thanh toán giao dịch
  const { mutate: processPayment, isPending } = useProcessPaymentTransaction();

  // Số tiền cọc cần thu (Ưu tiên lấy còn lại của Invoice, nếu chưa có lấy depositAmount)
  const amountToPay = invoice?.remainingAmount ?? depositAmount;

  // Derive số tiền khách đưa
  const cashReceived = userCashInput ?? amountToPay;

  // Tiền thừa trả lại khách
  const changeAmount = Math.max(0, cashReceived - amountToPay);

  // Gợi ý mệnh giá
  const cashSuggestions = useMemo(() => {
    if (!amountToPay) return CASH_SUGGESTIONS_BASE;
    const suggestions = new Set<number>();
    suggestions.add(amountToPay);
    CASH_SUGGESTIONS_BASE.forEach((val) => {
      if (val >= amountToPay) suggestions.add(val);
    });
    return Array.from(suggestions).sort((a, b) => a - b);
  }, [amountToPay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetInvoiceId) {
      alert("Chưa tìm thấy hóa đơn thu cọc cho đơn đặt bàn này!");
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
          note.trim() || `Thu tiền cọc đơn đặt bàn ${reservation.customerName}`,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-surface-container-low/50">
          <div>
            <h3 className="text-lg font-bold text-on-surface">
              Thu Tiền Cọc Đặt Bàn
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Khách hàng:{" "}
              <span className="font-semibold text-on-surface">
                {reservation.customerName}
              </span>{" "}
              ({reservation.customerPhone})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-5 flex-1 overflow-y-auto space-y-4"
        >
          {/* THÔNG TIN HÓA ĐƠN & SỐ TIỀN CỌC */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              Số tiền cọc cần thanh toán
            </span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-300">
              {isLoadingInvoice
                ? "Đang tải hóa đơn..."
                : `${amountToPay.toLocaleString("vi-VN")} đ`}
            </div>
            {invoice?.invoiceCode && (
              <span className="text-[11px] text-amber-600/80 mt-1 block">
                Mã HĐ: #{invoice.invoiceCode}
              </span>
            )}
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  method: PaymentMethod.CASH,
                  icon: "Banknote",
                  label: PaymentMethodLabel[PaymentMethod.CASH],
                },
                {
                  method: PaymentMethod.BANK_TRANSFER,
                  icon: "QrCode",
                  label: PaymentMethodLabel[PaymentMethod.BANK_TRANSFER],
                },
                {
                  method: PaymentMethod.E_WALLET,
                  icon: "Wallet",
                  label: PaymentMethodLabel[PaymentMethod.E_WALLET],
                },
              ].map((item) => (
                <button
                  key={item.method}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(item.method as PaymentMethod);
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
                  <Icon name={item.icon as IconName} className="w-5 h-5" />
                  <span className="text-[11px] text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* GIAO DIỆN TIỀN MẶT */}
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
                {cashSuggestions.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setUserCashInput(amt)}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant rounded-lg text-xs font-semibold text-on-surface transition cursor-pointer"
                  >
                    {amt.toLocaleString("vi-VN")} đ
                  </button>
                ))}
              </div>

              {/* Tiền thừa */}
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

          {/* CHUYỂN KHOẢN / VÍ ĐIỆN TỬ */}
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
              placeholder="Ghi chú thu cọc..."
              className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* BUTTONS */}
          <div className="pt-3 border-t border-outline-variant/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 border border-outline-variant/50 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
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
              className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              {isPending && (
                <Icon name="Loader2" className="w-3.5 h-3.5 animate-spin" />
              )}
              {isPending ? "Đang xử lý..." : "Xác Nhận Thu Cọc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
