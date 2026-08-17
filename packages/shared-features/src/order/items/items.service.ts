import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    OrderItemCreateRequest,
    OrderItemUpdateRequest,
    OrderItemStatusUpdateRequest,
    OrderItemResponse,
    KitchenItemFilterParams,
} from './items.types';

export const orderItemsService = {
    getKitchenItems: (params?: KitchenItemFilterParams) => {
        return apiClient.get<OffsetPageResponse<OrderItemResponse>>('/orders/items/kitchen', { params });
    },
    updateStatus: (itemId: string, payload: OrderItemStatusUpdateRequest) => {
        return apiClient.patch<OrderItemResponse>(`/orders/items/${itemId}/status`, payload);
    },


};