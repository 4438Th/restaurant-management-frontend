import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { invoiceService } from './invoice.service';
import {
    InvoiceCreateRequest,
    InvoiceCancelRequest,
    InvoiceFilterParams
} from './invoice.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const invoiceKeys = {
    all: ['invoices'] as const,
    lists: () => [...invoiceKeys.all, 'list'] as const,
    list: (params?: InvoiceFilterParams) => [...invoiceKeys.lists(), params] as const,
    details: () => [...invoiceKeys.all, 'detail'] as const,
    detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export const INVOICES_QUERY_KEY = invoiceKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const useInvoices = (params?: InvoiceFilterParams) => {
    return useQuery({
        queryKey: invoiceKeys.list(params),
        queryFn: () => invoiceService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useInvoiceDetail = (id: string, enabled = true) => {
    return useQuery({
        queryKey: invoiceKeys.detail(id),
        queryFn: () => invoiceService.getById(id),
        enabled: Boolean(id) && enabled,
        staleTime: 30 * 1000,
    });
};
export const useInvoiceByTarget = (targetId: string, enabled = true) => {
    return useQuery({
        queryKey: invoiceKeys.list({ targetId, size: 1 }),
        queryFn: async () => {
            const response = await invoiceService.getAll({ targetId, size: 1 });
            return response.data?.[0] ?? null;
        },
        enabled: Boolean(targetId) && enabled,
        staleTime: 30 * 1000,
    });
};
export const useCreateInvoice = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, InvoiceCreateRequest>({
        mutationFn: (payload: InvoiceCreateRequest) => invoiceService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        },
    });
};

export const useCancelInvoice = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload?: InvoiceCancelRequest }>({
        mutationFn: ({ id, payload }) => invoiceService.cancelInvoice(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
        },
    });
};