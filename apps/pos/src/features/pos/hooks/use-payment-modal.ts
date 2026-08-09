// apps/pos/src/features/pos/hooks/use-payment-modal.ts

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useCheckoutOrder, type OrderItemResponse } from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import type { CartItem } from "../types";

export interface PaymentOrderDetail {
    id: string;
    items?: OrderItemResponse[];
    orderDetails?: OrderItemResponse[];
    tableId?: string;
    tableName?: string;
    totalAmount?: number | string; // 👈 Chấp nhận cả string | number
}

export interface UsePaymentModalParams {
    orderDetail?: PaymentOrderDetail | null;
    cart?: CartItem[];
    onSuccess?: () => void;
    onClose: () => void;
}

export function usePaymentModal({
    orderDetail,
    cart = [],
    onSuccess,
    onClose,
}: UsePaymentModalParams) {
    const clearCart = usePosStore((state) => state.clearCart);
    const resetCartAndOrder = usePosStore((state) => state.resetCartAndOrder);

    const checkoutMutation = useCheckoutOrder();
    const [cashReceived, setCashReceived] = useState<number>(0);

    // Tính tổng tiền cần thanh toán
    const totalAmount = useMemo(() => {
        // 1. Tính tổng từ danh sách món đã gửi server
        const serverItems = orderDetail?.items || orderDetail?.orderDetails || [];
        const existingTotal = serverItems.reduce((sum, item) => {
            return sum + (Number(item.price) || 0) * (item.quantity || 1);
        }, 0);

        // NẾU serverItems rỗng nhưng BE có trả về totalAmount thì ép kiểu Number()
        const finalServerTotal =
            existingTotal > 0
                ? existingTotal
                : Number(orderDetail?.totalAmount) || 0;

        // 2. Tính tổng tiền từ món mới thêm trong giỏ hàng (chưa gửi bếp)
        const draftTotal = cart.reduce((sum, item) => {
            return sum + (Number(item.dish.price) || 0) * item.quantity;
        }, 0);

        return finalServerTotal + draftTotal;
    }, [orderDetail, cart]);

    const changeAmount = Math.max(0, cashReceived - totalAmount);

    // Mệnh giá tiền gợi ý
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

    // Xử lý xác nhận thanh toán
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
            resetCartAndOrder();
            onSuccess?.();
            onClose();
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err?.message || "Thanh toán thất bại, vui lòng thử lại!");
        }
    };

    return {
        cashReceived,
        setCashReceived,
        totalAmount,
        changeAmount,
        cashSuggestions,
        handleConfirmPayment,
        isSubmitting: checkoutMutation.isPending,
    };
}