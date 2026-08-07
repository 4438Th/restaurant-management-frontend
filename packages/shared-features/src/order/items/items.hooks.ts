import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { orderItemsService } from './items.service';
import { orderKeys } from '../orders';
import {
    OrderItemCreateRequest,
    OrderItemUpdateRequest,
    OrderItemStatusUpdateRequest,
    KitchenItemFilterParams,
} from './items.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const orderItemKeys = {
    all: ['order-items'] as const,
    kitchen: () => [...orderItemKeys.all, 'kitchen'] as const,
    kitchenList: (params?: KitchenItemFilterParams) => [...orderItemKeys.kitchen(), params] as const,
};

export const ORDER_ITEMS_QUERY_KEY = orderItemKeys.all;

// ==========================================
// QUERY HOOKS
// ==========================================

export const useKitchenItems = (params?: KitchenItemFilterParams) => {
    return useQuery({
        queryKey: orderItemKeys.kitchenList(params),
        queryFn: () => orderItemsService.getKitchenItems(params ?? {}),
        placeholderData: (previousData) => previousData,
        staleTime: 10 * 1000, // Đặt 10s cho màn hình Bếp để cập nhật dữ liệu nhanh hơn
    });
};

// ==========================================
// MUTATION HOOKS
// ==========================================

export const useAddItemsToOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        ApiError,
        { orderId: string; payload: OrderItemCreateRequest[] }
    >({
        mutationFn: ({ orderId, payload }) =>
            orderItemsService.addItemsToOrder(orderId, payload),
        onSuccess: (_, variables) => {
            // Refresh danh sách bếp
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
            // Refresh chi tiết đơn hàng tương ứng
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useUpdateOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        ApiError,
        { itemId: string; orderId?: string; payload: OrderItemUpdateRequest }
    >({
        mutationFn: ({ itemId, payload }) =>
            orderItemsService.updateItem(itemId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
            if (variables.orderId) {
                queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
            }
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useUpdateOrderItemStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        ApiError,
        { itemId: string; orderId?: string; payload: OrderItemStatusUpdateRequest }
    >({
        mutationFn: ({ itemId, payload }) =>
            orderItemsService.updateStatus(itemId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
            if (variables.orderId) {
                queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
            }
        },
    });
};

export const useRemoveOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation<
        unknown,
        ApiError,
        { itemId: string; orderId?: string }
    >({
        mutationFn: ({ itemId }) => orderItemsService.removeItem(itemId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
            if (variables.orderId) {
                queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
            }
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};