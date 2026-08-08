import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { ordersService } from './orders.service';
import { orderItemKeys } from '../items';
import {
    OrderResponse,
    OrderCreateRequest,
    OrderUpdateInfoRequest,
    OrderChangeTableRequest,
    OrderCancelRequest,
    OrderFilterParams,
} from './orders.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (params?: OrderFilterParams) => [...orderKeys.lists(), params] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const ORDERS_QUERY_KEY = orderKeys.all;

const TABLE_QUERY_KEY = ['tables'];

// ==========================================
// QUERY HOOKS
// ==========================================

export const useOrders = (params?: OrderFilterParams) => {
    return useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => ordersService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useOrderDetail = (id: string, enabled = true) => {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => ordersService.getById(id),
        enabled: Boolean(id) && enabled,
        staleTime: 30 * 1000,
    });
};

// ==========================================
// MUTATION HOOKS
// ==========================================

/** Tạo đơn hàng mới */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<OrderResponse, ApiError, OrderCreateRequest>({
        mutationFn: (payload: OrderCreateRequest) => ordersService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
        },
    });
};

/** Cập nhật thông tin đơn (Tên khách, SĐT, Reservation...) */
export const useUpdateOrderInfo = () => {
    const queryClient = useQueryClient();
    return useMutation<OrderResponse, ApiError, { id: string; payload: OrderUpdateInfoRequest }>({
        mutationFn: ({ id, payload }) => ordersService.updateInfo(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
        },
    });
};

/** Chuyển bàn */
export const useChangeTable = () => {
    const queryClient = useQueryClient();
    return useMutation<OrderResponse, ApiError, { id: string; payload: OrderChangeTableRequest }>({
        mutationFn: ({ id, payload }) => ordersService.changeTable(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
        },
    });
};

/** Thanh toán đơn hàng */
export const useCheckoutOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<OrderResponse, ApiError, string>({
        mutationFn: (id: string) => ordersService.checkout(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
        },
    });
};

/** Hủy đơn hàng */
export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, { id: string; payload: OrderCancelRequest }>({
        mutationFn: ({ id, payload }) => ordersService.cancel(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: TABLE_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: orderItemKeys.kitchen() });
        },
    });
};