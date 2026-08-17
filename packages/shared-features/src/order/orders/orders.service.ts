import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    OrderCreateRequest,
    OrderUpdateInfoRequest,
    OrderCancelRequest,
    OrderResponse,
    OrderFilterParams,
    SendItemsToPreparationRequest,
    OrderItemCreateRequest,
    OrderItemUpdateRequest,
    OrderItemResponse,
} from './orders.types';

export const ordersService = {
    // 1. Tạo đơn hàng mới (Dùng cho bàn trống tạo order trực tiếp)
    create: (payload: OrderCreateRequest) => {
        return apiClient.post<OrderResponse>('/orders', payload);
    },

    // 2. Lấy danh sách đơn hàng (Filter & Offset Pagination)
    getAll: (params?: OrderFilterParams) => {
        return apiClient.get<OffsetPageResponse<OrderResponse>>('/orders', { params });
    },

    // 3. Lấy chi tiết đơn hàng theo ID
    getById: (id: string) => {
        return apiClient.get<OrderResponse>(`/orders/${id}`);
    },

    // 4. Cập nhật thông tin chung của đơn hàng
    updateInfo: (id: string, payload: OrderUpdateInfoRequest) => {
        return apiClient.put<OrderResponse>(`/orders/${id}`, payload);
    },

    // 5. Thêm danh sách món vào Order đã tồn tại (Giải quyết lỗi 40105 khi Check-in)
    addItemsToOrder: (orderId: string, payload: OrderItemCreateRequest[]) => {
        return apiClient.post<OrderItemResponse[]>(`/orders/${orderId}/items`, payload);
    },

    // 6. Gửi món xuống bếp/bar chế biến
    sendItemsToPreparation: (id: string, payload: SendItemsToPreparationRequest) => {
        return apiClient.post<OrderResponse>(`/orders/${id}/items/send-to-preparation`, payload);
    },

    // 7. Cập nhật số lượng / ghi chú của 1 món trong đơn
    updateItem: (itemId: string, payload: OrderItemUpdateRequest) => {
        return apiClient.put<OrderItemResponse>(`/orders/items/${itemId}`, payload);
    },

    // 8. Xóa món khỏi đơn hàng
    removeItem: (itemId: string) => {
        return apiClient.delete<void>(`/orders/items/${itemId}`);
    },

    // 9. Checkout / Thanh toán
    checkout: (id: string) => {
        return apiClient.put<OrderResponse>(`/orders/${id}/check-out`);
    },

    // 10. Hủy đơn hàng
    cancel: (id: string, payload: OrderCancelRequest) => {
        return apiClient.put<void>(`/orders/${id}/cancel`, payload);
    },
};