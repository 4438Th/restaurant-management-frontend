import { AuditEntity, WithOffsetPagination } from "@repo/core";

// ==========================================
// ENUMS & LABELS
// ==========================================

export enum PaymentMethod {
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    E_WALLET = "E_WALLET",
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Tiền mặt",
    [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản ngân hàng",
    [PaymentMethod.E_WALLET]: "Ví điện tử",
};

export enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}

export const TransactionStatusLabel: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: "Đang xử lý",
    [TransactionStatus.SUCCESS]: "Thành công",
    [TransactionStatus.FAILED]: "Thất bại",
    [TransactionStatus.CANCELLED]: "Đã hủy",
};

export enum TransactionType {
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
}

export const TransactionTypeLabel: Record<TransactionType, string> = {
    [TransactionType.PAYMENT]: "Thanh toán",
    [TransactionType.REFUND]: "Hoàn tiền",
};

// ==========================================
// REQUEST & RESPONSE INTERFACES
// ==========================================

export interface PaymentTransactionCreateRequest {
    invoiceId: string;
    type?: TransactionType;
    amount: number;
    paymentMethod: PaymentMethod;
    externalRefNo?: string;
    note?: string;
}

export interface PaymentTransactionResponse extends AuditEntity {
    id: string;
    transactionCode: string;
    invoiceId: string;
    type: TransactionType;
    amount: number;
    paymentMethod: PaymentMethod;
    status: TransactionStatus;
    externalRefNo?: string;
    note?: string;
}

export interface PaymentTransactionFilter {
    search?: string;
    invoiceId?: string;
    status?: TransactionStatus;
    type?: TransactionType;
    paymentMethod?: PaymentMethod;
    fromDate?: string;
    toDate?: string;
}

export type PaymentTransactionFilterParams = WithOffsetPagination<PaymentTransactionFilter>;