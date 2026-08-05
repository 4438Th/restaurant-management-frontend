import { AuditEntity, WithCursorPagination } from "@repo/core";

// ==========================================
// ENUMS & LABELS
// ==========================================

export enum TableReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    ARRIVED = "ARRIVED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    DELAYED = "DELAYED",
    NO_SHOW = "NO_SHOW",
}

export const TableReservationStatusLabel: Record<TableReservationStatus, string> = {
    [TableReservationStatus.PENDING]: "Chờ xác nhận",
    [TableReservationStatus.CONFIRMED]: "Đã xác nhận",
    [TableReservationStatus.ARRIVED]: "Khách đã đến",
    [TableReservationStatus.COMPLETED]: "Hoàn thành",
    [TableReservationStatus.CANCELLED]: "Đã hủy",
    [TableReservationStatus.DELAYED]: "Trễ giờ",
    [TableReservationStatus.NO_SHOW]: "Khách không đến",
};

// ==========================================
// REQUEST DTOs
// ==========================================

export interface TableReservationCreateRequest {
    tableId: string;
    customerName: string;
    customerPhone: string;
    guestCount: number;
    reservationTime: string; // ISO string (e.g. 2026-08-15T19:00:00)
    note?: string;
}

export interface TableReservationUpdateRequest {
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    guestCount?: number;
    reservationTime?: string;
    note?: string;
}

export interface TableReservationCancelRequest {
    cancelReason: string;
}

// ==========================================
// RESPONSE DTOs
// ==========================================

export interface TableReservationResponse extends AuditEntity {
    id: string;
    tableId: string;
    tableName: string;
    tableArea: string;
    customerName: string;
    customerPhone: string;
    guestCount: number;
    reservationTime: string;
    status: TableReservationStatus;
    note?: string;
    cancelReason?: string;
}

export interface TableReservationAnalyticsResponse {
    totalReservations: number;
    totalByStatus: Record<TableReservationStatus, number>;
    totalGuestsToday: number;
}

// ==========================================
// FILTER & PAGINATION PARAMS
// ==========================================

export interface TableReservationFilter {
    search?: string;
    status?: TableReservationStatus | string;
}

/**
 * Khớp với TableReservationFilterRequest kế thừa từ CursorPageRequest ở Backend
 */
export type TableReservationFilterParams = WithCursorPagination<TableReservationFilter>;