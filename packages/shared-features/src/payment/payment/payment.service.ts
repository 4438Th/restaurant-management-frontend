import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    PaymentTransactionCreateRequest,
    PaymentTransactionFilterParams,
    PaymentTransactionResponse
} from './payment.types';

export const paymentService = {
    processTransaction: (payload: PaymentTransactionCreateRequest) => {
        return apiClient.post<PaymentTransactionResponse>('/payment-transactions', payload);
    },

    getAll: (params?: PaymentTransactionFilterParams) => {
        return apiClient.get<OffsetPageResponse<PaymentTransactionResponse>>('/payment-transactions', { params });
    },

    getById: (id: string) => {
        return apiClient.get<PaymentTransactionResponse>(`/payment-transactions/${id}`);
    },
};