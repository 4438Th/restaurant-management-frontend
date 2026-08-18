import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { paymentService } from './payment.service';
import { invoiceKeys } from '../invoice/invoice.hooks';
import {
    PaymentTransactionCreateRequest,
    PaymentTransactionFilterParams
} from './payment.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const paymentTransactionKeys = {
    all: ['payment-transactions'] as const,
    lists: () => [...paymentTransactionKeys.all, 'list'] as const,
    list: (params?: PaymentTransactionFilterParams) => [...paymentTransactionKeys.lists(), params] as const,
    details: () => [...paymentTransactionKeys.all, 'detail'] as const,
    detail: (id: string) => [...paymentTransactionKeys.details(), id] as const,
};

export const PAYMENT_TRANSACTIONS_QUERY_KEY = paymentTransactionKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const usePaymentTransactions = (params?: PaymentTransactionFilterParams) => {
    return useQuery({
        queryKey: paymentTransactionKeys.list(params),
        queryFn: () => paymentService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const usePaymentTransactionDetail = (id: string, enabled = true) => {
    return useQuery({
        queryKey: paymentTransactionKeys.detail(id),
        queryFn: () => paymentService.getById(id),
        enabled: Boolean(id) && enabled,
        staleTime: 30 * 1000,
    });
};

export const useProcessPaymentTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, PaymentTransactionCreateRequest>({
        mutationFn: (payload: PaymentTransactionCreateRequest) =>
            paymentService.processTransaction(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: paymentTransactionKeys.lists() });

            if (variables.invoiceId) {
                queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(variables.invoiceId) });
            }
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        },
    });
};