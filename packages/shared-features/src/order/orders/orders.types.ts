import { AuditEntity, WithOffsetPagination } from "@repo/core";
import type {
    OrderItemCreateRequest,
    OrderItemResponse,
} from "../items/items.types";


// ENUMS & LABELS


export enum OrderStatus {
    DRAFT = "DRAFT",
    PRE_ORDER = "PRE_ORDER",
    PROCESSING = "PROCESSING",
    SERVED = "SERVED",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    COMPLETED = "COMPLETED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: "Nháp",
    [OrderStatus.PRE_ORDER]: "Đặt trước",
    [OrderStatus.PROCESSING]: "Đang phục vụ",
    [OrderStatus.SERVED]: "Đã đủ món",
    [OrderStatus.PENDING_PAYMENT]: "Chờ thanh toán",
    [OrderStatus.COMPLETED]: "Hoàn thành",
    [OrderStatus.REFUNDED]: "Đã hoàn tiền",
    [OrderStatus.CANCELLED]: "Đã hủy",
};

export type { OrderItemCreateRequest, OrderItemResponse };

// REQUEST
export interface OrderCreateRequest {
    tableId: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    items?: OrderItemCreateRequest[];
}


export interface OrderUpdateInfoRequest {
    tableId?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
}
export interface SendItemsToPreparationRequest {
    itemIds: string[];
}
export interface OrderItemUpdateRequest {
    quantity: number;
    note?: string;
}
export interface OrderCancelRequest {
    cancelReason: string;
}
// RESPONSE
export interface OrderResponse extends AuditEntity {
    id: string;
    tableId: string;
    tableName?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    status: OrderStatus;
    totalAmount: number | string;
    cancelReason?: string;
    items?: OrderItemResponse[];
}

export interface OrderFilter {
    search?: string;
    status?: OrderStatus;
    tableId?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    fromDate?: string;
    toDate?: string;
}

export type OrderFilterParams = WithOffsetPagination<OrderFilter>;