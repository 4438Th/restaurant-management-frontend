import { AuditEntity, WithCursorPagination, WithOffsetPagination } from "@repo/core";

// ==========================================
// 1. ENUMS & LABELS
// ==========================================

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
    [OrderItemStatus.READY]: "Chờ cung ứng",
    [OrderItemStatus.SERVED]: "Đã cung ứng",
    [OrderItemStatus.CANCELLED]: "Đã hủy",
    [OrderItemStatus.REFUNDED]: "Đã hoàn tiền",
};

// ==========================================
// 2. REQUEST INTERFACES
// ==========================================

export interface OrderItemCreateRequest {
    dishId: string;
    quantity: number;
    note?: string;
}

export interface OrderItemUpdateRequest {
    quantity: number;
    note?: string;
}

export interface OrderItemStatusUpdateRequest {
    status: OrderItemStatus;
}

// ==========================================
// 3. RESPONSE INTERFACES
// ==========================================

/**
 * Khớp 100% với OrderItemResponse.java từ Spring Boot Backend
 * Kế thừa AuditEntity (id, createdAt, createdBy, updatedAt, updatedBy)
 */
export interface OrderItemResponse extends AuditEntity {
    id: string;
    orderId: string;

    dishId: string;
    dishName: string;
    dishImage?: string;

    quantity: number;
    /** BigDecimal từ BE có thể serialize thành number hoặc string */
    price: number | string;
    totalPrice?: number | string;

    note?: string;
    cancelReason?: string;
    status: OrderItemStatus;
}

// ==========================================
// 4. FILTER INTERFACES
// ==========================================

/** Khớp 100% với KitchenItemFilterRequest.java (Phân trang Offset) */
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