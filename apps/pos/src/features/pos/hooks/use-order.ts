import { useMemo } from "react";
import { toast } from "sonner";
import type { ApiError } from "@repo/core";
import {
    OrderStatus,
    OrderItemStatus,
    useOrderDetail,
    useCreateOrder,
    useAddItemsToOrder,
    type OrderResponse,
    type OrderItemResponse,
} from "@repo/shared-features/order";
import { usePosStore, type DraftFormData } from "@/stores";

export function useOrder() {
    // Global Store States & Actions
    const cart = usePosStore((s) => s.cart);
    const activeOrderId = usePosStore((s) => s.activeOrderId);
    const selectedTableId = usePosStore((s) => s.selectedTableId);
    const customerInfo = usePosStore((s) => s.customerInfo);

    const activeDraftId = usePosStore((s) => s.activeDraftId);
    const closeDraft = usePosStore((s) => s.closeDraft);
    const openCreateModal = usePosStore((s) => s.openCreateModal);

    const addToCart = usePosStore((s) => s.addToCart);
    const updateQuantity = usePosStore((s) => s.updateQuantity);
    const clearCart = usePosStore((s) => s.clearCart);
    const resetCartAndOrder = usePosStore((s) => s.resetCartAndOrder);
    const setActiveOrder = usePosStore((s) => s.setActiveOrder);

    // Mutations
    const createOrderMutation = useCreateOrder();
    const addItemsMutation = useAddItemsToOrder();

    // Fetch chi tiết đơn hàng hiện tại từ Server (Món đã gửi bếp)
    const { data: activeOrderDetail, isLoading: isOrderDetailLoading } = useOrderDetail(
        activeOrderId ?? undefined
    );

    const existingItems: OrderItemResponse[] = useMemo(
        () => activeOrderDetail?.items ?? [],
        [activeOrderDetail]
    );

    // ---------------------------------------------------------------------------
    // 1. TÍNH TOÁN TIỀN VÀ SỐ LƯỢNG MÓN
    // ---------------------------------------------------------------------------

    const draftTotal = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + (Number(item.dish.price) || 0) * item.quantity,
            0
        );
    }, [cart]);

    const existingTotal = useMemo(() => {
        return existingItems.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
            0
        );
    }, [existingItems]);

    const grandTotal = draftTotal + existingTotal;

    const totalItemCount = useMemo(() => {
        return (
            cart.reduce((sum, item) => sum + item.quantity, 0) +
            existingItems.reduce((sum, item) => sum + item.quantity, 0)
        );
    }, [cart, existingItems]);

    // Điều kiện sẵn sàng thanh toán
    const isReadyForCheckout = useMemo(() => {
        if (existingItems.length === 0) return false;

        const orderStatus = activeOrderDetail?.status;

        if (
            orderStatus === OrderStatus.SERVED ||
            orderStatus === OrderStatus.COMPLETED
        ) {
            return true;
        }

        return existingItems.every(
            (item) =>
                item.status === OrderItemStatus.SERVED ||
                item.status === OrderItemStatus.CANCELLED
        );
    }, [existingItems, activeOrderDetail]);

    // ---------------------------------------------------------------------------
    // 2. LOGIC GỬI CHẾ BIẾN (SEND TO KITCHEN)
    // ---------------------------------------------------------------------------

    const handleSendToKitchen = async (
        overrideParams?: DraftFormData
    ): Promise<OrderResponse | boolean> => {
        // Nếu giỏ hàng trống thì chặn luôn
        if (cart.length === 0) {
            toast.error("Giỏ hàng đang trống!");
            return false;
        }

        const targetTableId = overrideParams?.tableId || selectedTableId;

        const itemsPayload = cart.map((item) => ({
            dishId: item.dish.id,
            quantity: item.quantity,
            note: item.note?.trim() || undefined,
        }));

        try {
            let targetOrderId = activeOrderId;
            let createdOrder: OrderResponse | null = null;

            // BƯỚC 1: NẾU CHƯA CÓ ACTIVE ORDER ID TRÊN SERVER -> TẠO ĐƠN MỚI
            if (!targetOrderId) {
                if (!targetTableId) {
                    toast.info("Vui lòng chọn bàn và tạo đơn trước khi gửi bếp!");
                    openCreateModal();
                    return false;
                }

                // Gọi API tạo đơn chính thức cho bàn
                createdOrder = await createOrderMutation.mutateAsync({
                    tableId: targetTableId,
                    customerName: overrideParams?.customerName || customerInfo?.customerName,
                    customerPhone: overrideParams?.customerPhone || customerInfo?.customerPhone,
                });

                targetOrderId = createdOrder.id;

                // Cập nhật trạng thái Active Order chính thức ngay lập tức
                setActiveOrder({
                    id: createdOrder.id,
                    tableId: createdOrder.tableId,
                    tableName: createdOrder.tableName,
                    items: createdOrder.items || [],
                });
            }

            // BƯỚC 2: THÊM MÓN VÀO ĐƠN TRÊN SERVER (DÙ LÀ ĐƠN CŨ HAY VỪA TẠO MỚI)
            if (targetOrderId) {
                await addItemsMutation.mutateAsync({
                    orderId: targetOrderId,
                    requests: itemsPayload,
                });

                // Đóng tab nháp local nếu có
                if (activeDraftId && activeDraftId.startsWith("draft-")) {
                    closeDraft(activeDraftId);
                }

                // Làm sạch giỏ hàng tạm sau khi đã đẩy lên Server
                clearCart();

                toast.success("Đã gửi món xuống bếp thành công!");
                return createdOrder || true;
            }
        } catch (error: unknown) {
            console.error("Lỗi khi gửi order xuống bếp:", error);
            const apiError = error as ApiError;
            const msg =
                apiError?.message ||
                (error instanceof Error
                    ? error.message
                    : "Gửi đơn thất bại. Vui lòng thử lại!");

            toast.error(msg);
            return false;
        }

        return false;
    };

    return {
        // Cart & Order States
        cart,
        existingItems,
        activeOrderDetail,
        isOrderDetailLoading,

        // Calculated Money & Quantity
        draftTotal,
        existingTotal,
        grandTotal,
        totalItemCount,
        isReadyForCheckout,

        // Actions & Mutates
        addToCart,
        updateQuantity,
        clearCart,
        resetCartAndOrder,
        handleSendToKitchen,
        isSubmitting: createOrderMutation.isPending || addItemsMutation.isPending,
    };
}