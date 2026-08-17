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
    NO_SHOW = "NO_SHOW",
}

export const TableReservationStatusLabel: Record<TableReservationStatus, string> = {
    [TableReservationStatus.PENDING]: "Chờ xác nhận",
    [TableReservationStatus.CONFIRMED]: "Đã xác nhận",
    [TableReservationStatus.ARRIVED]: "Khách đến",
    [TableReservationStatus.COMPLETED]: "Hoàn thành",
    [TableReservationStatus.CANCELLED]: "Đã hủy",
    [TableReservationStatus.NO_SHOW]: "Khách không đến",
};

export enum PaymentMethod {
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    ONLINE_GATEWAY = "ONLINE_GATEWAY"
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Tiền mặt",
    [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản ngân hàng",
    [PaymentMethod.ONLINE_GATEWAY]: "Cổng trực truyến"
};

export enum TableArea {
    MAIN_HALL = "MAIN_HALL",
    PRIVATE_ROOM = "PRIVATE_ROOM",
    AIR_CONDITIONED = "AIR_CONDITIONED",
    ROOFTOP = "ROOFTOP",
}
export const TableAreaLabel: Record<TableArea, string> = {
    [TableArea.MAIN_HALL]: "Sảnh chính",
    [TableArea.PRIVATE_ROOM]: "Phòng riêng",
    [TableArea.AIR_CONDITIONED]: "Máy lạnh",
    [TableArea.ROOFTOP]: "Sân thượng",
};

// ==========================================
// REQUEST DTOs
// ==========================================

export interface TableReservationCreateRequest {
    tableId: string;
    customerName: string;
    customerPhone: string;
    guestCount: number;
    reservationTime: string;
    note?: string;
    preOrderItems?: PreOrderItemRequest[];
}

export interface TableReservationUpdateRequest {
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
    guestCount?: number;
    reservationTime?: string;
    note?: string;
    preOrderItems?: PreOrderItemRequest[];
}

export interface TableReservationCancelRequest {
    cancelReason: string;
}
export interface PreOrderItemRequest {
    dishId: string;
    quantity: number;
    note?: string;
}

export interface ConfirmDepositRequest {
    depositAmount: number | string;
    paymentMethod: PaymentMethod;
    transactionRef: string;
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
    depositAmount: number | string;
    isDepositPaid: boolean;
    depositMethod: PaymentMethod;
    depositPaidAt: string;
    depositTransactionRef: string;
    preOrderId?: string;
    preOrderItems?: PreOrderItemResponse[];
}
export interface PreOrderItemResponse {
    dishId: string;
    dishName: string;
    quantity: number;
    price: number | string;
    note?: string;
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