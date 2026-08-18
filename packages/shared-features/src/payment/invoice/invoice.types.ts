import { AuditEntity, WithOffsetPagination } from "@repo/core";
import { PaymentTransactionResponse } from "../payment/payment.types";

// ==========================================
// ENUMS & LABELS
// ==========================================

export enum InvoiceStatus {
    UNPAID = "UNPAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
}

export const InvoiceStatusLabel: Record<InvoiceStatus, string> = {
    [InvoiceStatus.UNPAID]: "Chưa thanh toán",
    [InvoiceStatus.PARTIALLY_PAID]: "Thanh toán một phần",
    [InvoiceStatus.PAID]: "Đã thanh toán",
    [InvoiceStatus.REFUNDED]: "Đã hoàn tiền",
    [InvoiceStatus.CANCELLED]: "Đã hủy",
};

export enum InvoiceType {
    ORDER = "ORDER",
    RESERVATION_DEPOSIT = "RESERVATION_DEPOSIT",
    OTHER = "OTHER",
}

export const InvoiceTypeLabel: Record<InvoiceType, string> = {
    [InvoiceType.ORDER]: "Đơn hàng",
    [InvoiceType.RESERVATION_DEPOSIT]: "Tiền cọc đặt bàn",
    [InvoiceType.OTHER]: "Khác",
};

// ==========================================
// REQUEST & RESPONSE INTERFACES
// ==========================================

export interface InvoiceCreateRequest {
    targetType: InvoiceType;
    targetId: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    subTotal: number;
    discountAmount?: number;
    taxAmount?: number;
    note?: string;
}

export interface InvoiceCancelRequest {
    reason?: string;
}

export interface InvoiceResponse extends AuditEntity {
    id: string;
    invoiceCode: string;
    targetType: InvoiceType;
    targetId: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    subTotal: number;
    discountAmount: number;
    taxAmount: number;
    finalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: InvoiceStatus;
    note?: string;
    transactions?: PaymentTransactionResponse[];
}

export interface InvoiceFilter {
    search?: string;
    status?: InvoiceStatus;
    targetType?: InvoiceType;
    targetId?: string;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
}

export type InvoiceFilterParams = WithOffsetPagination<InvoiceFilter>;