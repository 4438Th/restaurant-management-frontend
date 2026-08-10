import { AuditEntity, WithOffsetPagination } from "@repo/core";
// 1. IMPORT & TÁI SỬ DỤNG TỪ MODULE ITEMS (TRÁNH DUPLICATE DTO)
import type {
    OrderItemCreateRequest,
    OrderItemResponse,
} from "../items/items.types";

// ==========================================
// 1. ENUMS & LABELS
// ==========================================

export enum OrderStatus {
    DRAFT = "DRAFT",
    PROCESSING = "PROCESSING",
    SERVED = "SERVED",
    PENDING_PAYMENT = "PENDING_PAYMENT",
    COMPLETED = "COMPLETED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: "Nháp",
    [OrderStatus.PROCESSING]: "Đang phục vụ",
    [OrderStatus.SERVED]: "Đã đủ món",
    [OrderStatus.PENDING_PAYMENT]: "Chờ thanh toán",
    [OrderStatus.COMPLETED]: "Hoàn thành",
    [OrderStatus.REFUNDED]: "Đã hoàn tiền",
    [OrderStatus.CANCELLED]: "Đã hủy",
};

// 2. RE-EXPORT ĐỂ CÁC BÊN DÙNG MODULE ORDER KHÔNG BỊ BREAK IMPORT
export type { OrderItemCreateRequest, OrderItemResponse };

// ==========================================
// 2. REQUEST INTERFACES
// ==========================================

/** Khớp 100% với OrderCreateRequest.java */
export interface OrderCreateRequest {
    tableId: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    items?: OrderItemCreateRequest[];
}

/** Khớp 100% với OrderUpdateInfoRequest.java */
export interface OrderUpdateInfoRequest {
    tableId?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
}

/** Khớp 100% với OrderChangeTableRequest.java */
export interface OrderChangeTableRequest {
    newTableId: string;
}

/** Khớp 100% với OrderCancelRequest.java */
export interface OrderCancelRequest {
    cancelReason: string;
}

// ==========================================
// 3. RESPONSE INTERFACES
// ==========================================

/**
 * Khớp 100% với OrderResponse.java từ Spring Boot Backend
 * Kế thừa AuditEntity (id, createdAt, createdBy, updatedAt, updatedBy)
 */
export interface OrderResponse extends AuditEntity {
    id: string;
    tableId: string;
    tableName?: string;
    reservationId?: string;
    customerName?: string;
    customerPhone?: string;
    status: OrderStatus;
    /** BigDecimal từ BE có thể serialize thành number hoặc string */
    totalAmount: number | string;
    cancelReason?: string;
    items?: OrderItemResponse[];
}

// ==========================================
// 4. FILTER INTERFACES
// ==========================================

/** Khớp 100% với OrderFilterRequest.java */
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