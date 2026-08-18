import { AuditEntity, WithCursorPagination, WithOffsetPagination } from "@repo/core";
// ENUMS & LABELS

export enum OrderItemStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    READY = "READY",
    SERVED = "SERVED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export const OrderItemStatusLabel: Record<OrderItemStatus, string> = {
    [OrderItemStatus.PENDING]: "Chờ xử lý",
    [OrderItemStatus.PREPARING]: "Đang chế biến",
    [OrderItemStatus.READY]: "Sẵn sàng",
    [OrderItemStatus.SERVED]: "Đã ra món",
    [OrderItemStatus.CANCELLED]: "Đã hủy",
    [OrderItemStatus.REFUNDED]: "Đã hoàn tiền",
};

// REQUEST

export interface OrderItemCreateRequest {
    dishId: string;
    quantity: number;
    note?: string;
}

export interface OrderItemStatusUpdateRequest {
    status: OrderItemStatus;
}

// RESPONSE
export interface OrderItemResponse extends AuditEntity {
    id: string;
    orderId: string;

    dishId: string;
    dishName: string;
    dishImage?: string;

    quantity: number;
    price: number | string;
    totalPrice?: number | string;

    note?: string;
    cancelReason?: string;
    status: OrderItemStatus;
}
export interface KitchenItemFilter {
    search?: string;
    status?: OrderItemStatus;
    tableId?: string;
    orderId?: string;
    fromDate?: string;
    toDate?: string;
}

export type KitchenItemFilterParams = WithOffsetPagination<KitchenItemFilter>;

/** Khớp 100% với OrderItemFilterRequest.java (Phân trang Cursor) */
export interface OrderItemFilter {
    search?: string;
    status?: string;
}

export type OrderItemFilterParams = WithCursorPagination<OrderItemFilter>;