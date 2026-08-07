import { toast } from "sonner";
import { type ApiError } from "@repo/core";
import {
    useCreateOrder,
    useAddItemsToOrder,
    type OrderResponse,
} from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import type { CreateOrderFormData } from "../components/create-order-modal";

export function usePosOrder() {
    const { cart, activeOrderId, resetCartAndOrder, setActiveOrder } =
        usePosStore();

    const createOrderMutation = useCreateOrder();
    const addItemsMutation = useAddItemsToOrder();

    const handleSendToKitchen = async (
        params?: CreateOrderFormData
    ): Promise<boolean> => {
        if (cart.length === 0) {
            toast.error("Giỏ hàng đang trống!");
            return false;
        }

        // Chuẩn bị payload danh sách món từ Cart
        const itemsPayload = cart.map((item) => ({
            dishId: item.dish.id,
            quantity: item.quantity,
            note: item.note?.trim() || undefined,
        }));

        try {
            let targetOrderId = activeOrderId;

            // 1. NẾU CHƯA CÓ ORDER TRÊN SERVER -> GỌI MUTATION useCreateOrder
            if (!targetOrderId) {
                if (!params?.tableId) {
                    toast.error("Vui lòng chọn bàn phục vụ!");
                    return false;
                }

                const newOrder: OrderResponse = await createOrderMutation.mutateAsync({
                    tableId: params.tableId,
                    customerName: params.customerName,
                    customerPhone: params.customerPhone,
                });

                targetOrderId = newOrder.id;

                if (targetOrderId) {
                    setActiveOrder(targetOrderId);
                } else {
                    throw new Error("Không khởi tạo được mã đơn hàng từ Server.");
                }
            }

            // 2. THÊM MÓN VÀO ORDER
            if (targetOrderId) {
                await addItemsMutation.mutateAsync({
                    orderId: targetOrderId,
                    payload: itemsPayload,
                });

                resetCartAndOrder();
                toast.success("Đã gửi đơn xuống bếp thành công!");
                return true;
            }
        } catch (error: unknown) {
            console.error("Lỗi khi gửi order xuống bếp:", error);

            const apiError = error as ApiError;
            const msg =
                apiError?.message ||
                (error instanceof Error ? error.message : "Gửi đơn thất bại. Vui lòng thử lại!");

            toast.error(msg);
            return false;
        }

        return false;
    };

    return {
        handleSendToKitchen,
        isSubmitting: createOrderMutation.isPending || addItemsMutation.isPending,
    };
}