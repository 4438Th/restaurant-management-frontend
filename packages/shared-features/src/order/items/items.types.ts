import { AuditEntity, WithCursorPagination, WithOffsetPagination } from "@repo/core";

// ==========================================
// 1. ENUMS & LABELS
// ==========================================

export enum OrderItemStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    READY = 'READY',
    SERVED = 'SERVED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export const OrderItemStatusLabel: Record<OrderItemStatus, string> = {
    [OrderItemStatus.PENDING]: 'Chờ xử lý',
    [OrderItemStatus.PREPARING]: 'Đang chế biến',
    [OrderItemStatus.READY]: 'Chờ cung ứng',
    [OrderItemStatus.SERVED]: 'Đã cung ứng',
    [OrderItemStatus.CANCELLED]: 'Đã hủy',
    [OrderItemStatus.REFUNDED]: 'Đã hoàn tiền',
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

export interface OrderItemResponse extends AuditEntity {
    id: string;
    orderId: string;
    dishId: string;
    dishName: string;
    dishImage?: string;
    quantity: number;
    price: string;
    totalPrice: string;
    note?: string;
    cancelReason?: string;
    status: OrderItemStatus;
}

// ==========================================
// 4. FILTER INTERFACES
// ==========================================

// Filter theo phân trang Offset (Dùng cho màn hình Bếp / KDS)
export interface KitchenItemFilter {
    search?: string;
    status?: OrderItemStatus;
    tableId?: string;
    orderId?: string;
    fromDate?: string;
    toDate?: string;
}

export type KitchenItemFilterParams = WithOffsetPagination<KitchenItemFilter>;

// Filter theo phân trang Cursor (Dùng cho danh sách chi tiết món)
export interface OrderItemFilter {
    search?: string;
    status?: string;
}

export type OrderItemFilterParams = WithCursorPagination<OrderItemFilter>;