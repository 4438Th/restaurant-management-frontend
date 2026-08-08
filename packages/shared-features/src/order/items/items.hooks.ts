import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { orderItemsService } from './items.service';
import { orderKeys } from '../orders';
import {
    OrderItemCreateRequest,
    OrderItemUpdateRequest,
    OrderItemStatusUpdateRequest,
    OrderItemResponse,
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
        queryFn: () => orderItemsService.getKitchenItems(params),
        placeholderData: (previousData) => previousData,
        staleTime: 10 * 1000,
    });
};

// ==========================================
// MUTATION HOOKS
// ==========================================

/** Gửi món / Gọi thêm món vào đơn */
export const useAddItemsToOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<
        OrderItemResponse[],
        ApiError,
        { orderId: string; payload: OrderItemCreateRequest[] }
    >({
        mutationFn: ({ orderId, payload }) =>
            orderItemsService.addItemsToOrder(orderId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

/** Cập nhật số lượng / ghi chú món */
export const useUpdateOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation<
        OrderItemResponse,
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

/** Bếp cập nhật trạng thái chế biến (PENDING -> PREPARING -> READY -> SERVED -> CANCELLED) */
export const useUpdateOrderItemStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<
        OrderItemResponse,
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
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

/** Xóa món khỏi đơn */
export const useRemoveOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void,
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