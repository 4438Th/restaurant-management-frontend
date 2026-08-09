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

    const activeDraftId = usePosStore((s) => s.activeDraftId);
    const closeDraft = usePosStore((s) => s.closeDraft);

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

    // Điều kiện sẵn sàng thanh toán: 
    // Bắt buộc phải có món trên server và toàn bộ món đó phải ở trạng thái SERVED hoặc CANCELLED
    const isReadyForCheckout = useMemo(() => {
        if (existingItems.length === 0) return false;

        const orderStatus = activeOrderDetail?.status;

        // Nếu BE trả về trạng thái tổng đã hoàn thành/phục vụ xong
        if (
            orderStatus === OrderStatus.SERVED ||
            orderStatus === OrderStatus.COMPLETED
        ) {
            return true;
        }

        // Kiểm tra an toàn dựa trên tất cả món đã gửi bếp
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

            // Bước 1: Tạo đơn mới trên Server nếu chưa có activeOrderId
            if (!targetOrderId) {
                if (!targetTableId) {
                    return false;
                }

                createdOrder = await createOrderMutation.mutateAsync({
                    tableId: targetTableId,
                    customerName: overrideParams?.customerName,
                    customerPhone: overrideParams?.customerPhone,
                });

                targetOrderId = createdOrder.id;

                setActiveOrder({
                    id: createdOrder.id,
                    tableId: createdOrder.tableId,
                    tableName: createdOrder.tableName,
                    items: createdOrder.items,
                });
            }

            // Bước 2: Thêm món ăn vào đơn hàng (đã có hoặc vừa tạo)
            if (targetOrderId) {
                await addItemsMutation.mutateAsync({
                    orderId: targetOrderId,
                    payload: itemsPayload,
                });

                clearCart();

                if (activeDraftId && activeDraftId.startsWith("draft-")) {
                    closeDraft(activeDraftId);
                }

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