import { AuditEntity, WithOffsetPagination } from "@repo/core";

// ==========================================
// 1. ENUMS & LABELS
// ==========================================

export enum OrderStatus {
    DRAFT = 'DRAFT',
    PROCESSING = 'PROCESSING',
    SERVED = 'SERVED',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    COMPLETED = 'COMPLETED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'Nháp',
    [OrderStatus.PROCESSING]: 'Đang phục vụ',
    [OrderStatus.SERVED]: 'Đã ra đủ món',
    [OrderStatus.PENDING_PAYMENT]: 'Chờ thanh toán',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.REFUNDED]: 'Đã hoàn tiền',
    [OrderStatus.CANCELLED]: 'Đã hủy',
};

// Interface của từng món trong Order (OrderItemResponse)
export interface OrderItemResponse {
    id: string;
    dishId: string;
    dishName: string;
    quantity: number;
    price: string;
    note?: string;
    status?: string;
}

// ==========================================
// 2. REQUEST INTERFACES
// ==========================================

export interface OrderCreateRequest {
    tableId: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
}

export interface OrderUpdateInfoRequest {
    tableId?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
}

export interface OrderChangeTableRequest {
    targetTableId: string;
}

export interface OrderCancelRequest {
    cancelReason: string;
}

// ==========================================
// 3. RESPONSE INTERFACES
// ==========================================

export interface OrderResponse extends AuditEntity {
    id: string;
    tableId: string;
    tableName?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    status: OrderStatus;
    totalAmount: string;
    cancelReason?: string;
    /** Danh sách món ăn khớp với List<OrderItemResponse> items ở Backend */
    items?: OrderItemResponse[];
}

// ==========================================
// 4. FILTER INTERFACES
// ==========================================

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