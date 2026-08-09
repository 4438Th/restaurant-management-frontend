import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
    useCheckoutOrder,
    useOrderDetail,
} from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import { type PaymentOrderDetail } from "../types";

export function useCheckout() {
    // Local state cho Modal thanh toán
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [cashReceived, setCashReceived] = useState<number>(0);

    // Global Store States & Actions
    const cart = usePosStore((state) => state.cart);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const clearCart = usePosStore((state) => state.clearCart);
    const resetCartAndOrder = usePosStore((state) => state.resetCartAndOrder);

    // Fetch thông tin chi tiết đơn hàng hiện tại từ Server (nếu có activeOrderId)
    const { data: activeOrderDetail } = useOrderDetail(
        activeOrderId ?? undefined
    );

    // Mutation checkout
    const checkoutMutation = useCheckoutOrder();

    // Chuẩn hóa đối tượng thông tin đơn hàng phục vụ thanh toán
    const orderDetail: PaymentOrderDetail | null = useMemo(() => {
        if (!activeOrderId) return null;

        return {
            id: activeOrderId,
            items: activeOrderDetail?.items ?? [],
            tableId: activeOrderDetail?.tableId,
            tableName: activeOrderDetail?.tableName,
            totalAmount: activeOrderDetail?.totalAmount,
        };
    }, [activeOrderId, activeOrderDetail]);

    // ---------------------------------------------------------------------------
    // 1. TÍNH TOÁN TIỀN & MỆNH GIÁ GỢI Ý
    // ---------------------------------------------------------------------------

    const totalAmount = useMemo(() => {
        // 1. Tính tổng từ danh sách món đã gửi Server
        const serverItems = orderDetail?.items || orderDetail?.orderDetails || [];
        const existingTotal = serverItems.reduce((sum, item) => {
            return sum + (Number(item.price) || 0) * (item.quantity || 1);
        }, 0);

        // Nếu serverItems chưa cập nhật nhưng BE trả sẵn totalAmount thì ưu tiên lấy totalAmount
        const finalServerTotal =
            existingTotal > 0
                ? existingTotal
                : Number(orderDetail?.totalAmount) || 0;

        // 2. Tính tổng tiền từ món nháp trong giỏ hàng (chưa gửi bếp)
        const draftTotal = cart.reduce((sum, item) => {
            return sum + (Number(item.dish.price) || 0) * item.quantity;
        }, 0);

        return finalServerTotal + draftTotal;
    }, [orderDetail, cart]);

    // Tiền thừa trả lại khách
    const changeAmount = Math.max(0, cashReceived - totalAmount);

    // Gợi ý các mệnh giá tiền mặt phù hợp
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

    // ---------------------------------------------------------------------------
    // 2. HANDLERS
    // ---------------------------------------------------------------------------

    const handleOpenCheckout = () => {
        if (!activeOrderId && cart.length === 0) {
            toast.error("Không có đơn hàng nào cần thanh toán!");
            return;
        }
        setCashReceived(0);
        setIsOpen(true);
    };

    const handleCloseCheckout = () => {
        setIsOpen(false);
    };

    const handleConfirmPayment = async (onSuccess?: () => void) => {
        if (!orderDetail?.id) {
            toast.error("Không tìm thấy thông tin đơn hàng trên hệ thống!");
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
            resetCartAndOrder(); // Làm sạch phiên làm việc sau khi thanh toán xong
            setIsOpen(false);
            onSuccess?.();
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err?.message || "Thanh toán thất bại, vui lòng thử lại!");
        }
    };

    return {
        // Modal state
        isOpen,
        orderDetail,

        // Calculated amounts
        cashReceived,
        totalAmount,
        changeAmount,
        cashSuggestions,

        // Setters & Handlers
        setCashReceived,
        handleOpenCheckout,
        handleCloseCheckout,
        handleConfirmPayment,

        // Status
        isSubmitting: checkoutMutation.isPending,
    };
}