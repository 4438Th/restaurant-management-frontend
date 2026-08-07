import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    OrderItemCreateRequest,
    OrderItemUpdateRequest,
    OrderItemStatusUpdateRequest,
    OrderItemResponse,
    KitchenItemFilterParams,
} from './items.types';

export const orderItemsService = {
    // 1. Thêm danh sách món ăn vào đơn hàng (Batch insert)
    addItemsToOrder: (orderId: string, payload: OrderItemCreateRequest[]) => {
        return apiClient.post<OrderItemResponse[]>(`/orders/${orderId}/items`, payload);
    },

    // 2. Lấy danh sách món cho màn hình Bếp / KDS (Phân trang Offset + Filter)
    getKitchenItems: (params?: KitchenItemFilterParams) => {
        return apiClient.get<OffsetPageResponse<OrderItemResponse>>('/orders/items/kitchen', { params });
    },

    // 3. Cập nhật thông tin món (số lượng, ghi chú)
    updateItem: (itemId: string, payload: OrderItemUpdateRequest) => {
        return apiClient.put<OrderItemResponse>(`/orders/items/${itemId}`, payload);
    },

    // 4. Cập nhật trạng thái món (PENDING -> PREPARING -> READY -> SERVED...)
    updateStatus: (itemId: string, payload: OrderItemStatusUpdateRequest) => {
        return apiClient.patch<OrderItemResponse>(`/orders/items/${itemId}/status`, payload);
    },

    // 5. Xóa món khỏi đơn hàng
    removeItem: (itemId: string) => {
        return apiClient.delete<void>(`/orders/items/${itemId}`);
    },
};