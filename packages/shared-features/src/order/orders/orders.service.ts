import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    OrderCreateRequest,
    OrderUpdateInfoRequest,
    OrderChangeTableRequest,
    OrderCancelRequest,
    OrderResponse,
    OrderFilterParams,
} from './orders.types';

export const ordersService = {
    // 1. Tạo đơn hàng mới
    create: (payload: OrderCreateRequest) => {
        return apiClient.post<OrderResponse>('/orders', payload);
    },

    // 2. Lấy danh sách đơn hàng (có phân trang Offset + Filter)
    getAll: (params?: OrderFilterParams) => {
        return apiClient.get<OffsetPageResponse<OrderResponse>>('/orders', { params });
    },

    // 3. Lấy chi tiết đơn hàng theo ID
    getById: (id: string) => {
        return apiClient.get<OrderResponse>(`/orders/${id}`);
    },

    // 4. Cập nhật thông tin đơn hàng
    updateInfo: (id: string, payload: OrderUpdateInfoRequest) => {
        return apiClient.put<OrderResponse>(`/orders/${id}`, payload);
    },

    // 5. Chuyển bàn
    changeTable: (id: string, payload: OrderChangeTableRequest) => {
        return apiClient.patch<OrderResponse>(`/orders/${id}/change-table`, payload);
    },

    // 6. Thanh toán / Chốt đơn
    checkout: (id: string) => {
        return apiClient.put<OrderResponse>(`/orders/${id}/checkout`);
    },

    // 7. Hủy đơn hàng (Trả về void)
    cancel: (id: string, payload: OrderCancelRequest) => {
        return apiClient.put<void>(`/orders/${id}/cancel`, payload);
    },
};