import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    InvoiceCreateRequest,
    InvoiceCancelRequest,
    InvoiceFilterParams,
    InvoiceResponse
} from './invoice.types';

export const invoiceService = {
    create: (payload: InvoiceCreateRequest) => {
        return apiClient.post<InvoiceResponse>('/invoices', payload);
    },

    getAll: (params?: InvoiceFilterParams) => {
        return apiClient.get<OffsetPageResponse<InvoiceResponse>>('/invoices', { params });
    },

    getById: (id: string) => {
        return apiClient.get<InvoiceResponse>(`/invoices/${id}`);
    },

    cancelInvoice: (id: string, payload?: InvoiceCancelRequest) => {
        return apiClient.put<void>(`/invoices/${id}/cancel`, payload);
    },
};