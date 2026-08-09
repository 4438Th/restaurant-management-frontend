import { toast } from "sonner";
import { type ApiError } from "@repo/core";
import {
    useCreateOrder,
    useAddItemsToOrder,
    type OrderResponse,
} from "@repo/shared-features/order";
import { usePosStore, type DraftFormData } from "@/stores";

export function usePosOrder() {
    const { cart, activeOrderId, selectedTableId, resetCartAndOrder, setActiveOrder } = usePosStore();

    const createOrderMutation = useCreateOrder();
    const addItemsMutation = useAddItemsToOrder();

    /**
     * Xử lý gửi chế biến
     * @param overrideParams Thông tin bàn/khách từ Modal (nếu có)
     */
    const handleSendToKitchen = async (
        overrideParams?: DraftFormData
    ): Promise<OrderResponse | boolean> => {
        if (cart.length === 0) {
            toast.error("Giỏ hàng đang trống!");
            return false;
        }

        // Lấy tableId từ Modal override HOẶC từ Bàn đang được chọn sẵn trên POS
        const targetTableId = overrideParams?.tableId || selectedTableId;

        const itemsPayload = cart.map((item) => ({
            dishId: item.dish.id,
            quantity: item.quantity,
            note: item.note?.trim() || undefined,
        }));

        try {
            let targetOrderId = activeOrderId;
            let createdOrder: OrderResponse | null = null;

            // 1. Tạo đơn hàng mới nếu Đơn hàng chưa tồn tại trên Server
            if (!targetOrderId) {
                if (!targetTableId) {
                    // Trả về false để UI biết là cần bật Modal chọn Bàn
                    return false;
                }

                createdOrder = await createOrderMutation.mutateAsync({
                    tableId: targetTableId,
                    customerName: overrideParams?.customerName,
                    customerPhone: overrideParams?.customerPhone,
                });

                targetOrderId = createdOrder.id;

                // Cập nhật Active Order với Object đầy đủ thông tin từ Server
                setActiveOrder({
                    id: createdOrder.id,
                    tableId: createdOrder.tableId,
                    tableName: createdOrder.tableName,
                    items: createdOrder.items,
                });
            }

            // 2. Thêm danh sách món vào Đơn hàng đã có/vừa tạo
            if (targetOrderId) {
                await addItemsMutation.mutateAsync({
                    orderId: targetOrderId,
                    payload: itemsPayload,
                });

                resetCartAndOrder();
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
        handleSendToKitchen,
        isSubmitting: createOrderMutation.isPending || addItemsMutation.isPending,
    };
}