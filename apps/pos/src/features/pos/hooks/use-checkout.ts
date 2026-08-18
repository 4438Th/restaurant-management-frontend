import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useOrderDetail, useCheckoutOrder } from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import { type PaymentOrderDetail } from "../types";

export function useCheckout() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const cart = usePosStore((state) => state.cart);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const resetCartAndOrder = usePosStore((state) => state.resetCartAndOrder);

    const { data: activeOrderDetail } = useOrderDetail(
        activeOrderId ?? undefined
    );

    // Hook gọi API /orders/${id}/check-out
    const checkoutOrderMutation = useCheckoutOrder();

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

    // Xử lý khi bấm nút Thanh toán ở OrderCart
    const handleOpenCheckout = async () => {
        if (!activeOrderId && cart.length === 0) {
            toast.error("Không có đơn hàng nào cần thanh toán!");
            return;
        }

        if (!activeOrderId) {
            toast.error("Đơn hàng chưa được khởi tạo!");
            return;
        }

        try {
            // 1. Gọi API Checkout order để backend tự tạo Hóa đơn (Invoice)
            await checkoutOrderMutation.mutateAsync(activeOrderId);

            // 2. Mở Modal thanh toán (Lúc này useInvoiceByTarget trong PaymentModal sẽ fetch được Invoice)
            setIsOpen(true);
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err?.message || "Lỗi khởi tạo hóa đơn thanh toán!");
        }
    };

    const handleCloseCheckout = () => {
        setIsOpen(false);
    };

    const handlePaymentSuccess = () => {
        toast.success("Thanh toán hoàn tất!");
        resetCartAndOrder();
        setIsOpen(false);
    };

    return {
        isOpen,
        orderDetail,
        handleOpenCheckout,
        handleCloseCheckout,
        handlePaymentSuccess,
        isCreatingInvoice: checkoutOrderMutation.isPending, // Truyền trạng thái loading ra ngoài
    };
}