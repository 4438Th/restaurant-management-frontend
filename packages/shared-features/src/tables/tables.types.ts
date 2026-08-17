import { AuditEntity, WithOffsetPagination } from "@repo/core";

export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    DELETED = "DELETED",
}

export const TableStatusLabel: Record<TableStatus, string> = {
    [TableStatus.AVAILABLE]: "Bàn trống",
    [TableStatus.OCCUPIED]: "Đang sử dụng",
    [TableStatus.MAINTENANCE]: "Bảo trì",
    [TableStatus.DELETED]: "Đã xóa",
};

export enum TableType {
    STANDARD = "STANDARD",
    BOOTH_SOFA = "BOOTH_SOFA",
    HIGH_TOP = "HIGH_TOP",
    ROUND_BANQUET = "ROUND_BANQUET",
}

export const TableTypeLabel: Record<TableType, string> = {
    [TableType.STANDARD]: "Bàn tiêu chuẩn",
    [TableType.BOOTH_SOFA]: "Bàn Sofa",
    [TableType.HIGH_TOP]: "Bàn cao",
    [TableType.ROUND_BANQUET]: "Bàn tròn tiệc",
};

export enum TableArea {
    MAIN_HALL = "MAIN_HALL",
    PRIVATE_ROOM = "PRIVATE_ROOM",
    AIR_CONDITIONED = "AIR_CONDITIONED",
    ROOFTOP = "ROOFTOP",
}

export const TableAreaLabel: Record<TableArea, string> = {
    [TableArea.MAIN_HALL]: "Sảnh chính",
    [TableArea.PRIVATE_ROOM]: "Phòng riêng (VIP)",
    [TableArea.AIR_CONDITIONED]: "Khu máy lạnh",
    [TableArea.ROOFTOP]: "Sân thượng",
};

export interface TableCreateRequest {
    tableName: string;
    capacity: number;
    type: TableType;
    area: TableArea;
}

export interface TableUpdateRequest {
    tableName?: string;
    capacity?: number;
    status?: TableStatus;
    type?: TableType;
    area?: TableArea;
}

export interface TableResponse extends AuditEntity {
    id: string;
    tableName: string;
    capacity: number;
    type: TableType;
    status: TableStatus;
    area: TableArea;
    nextReservationTime?: string | null;
}

export interface TableAnalyticsResponse {
    totalTables: number;
    totalByStatus: Record<TableStatus, number>;
    totalByType: Record<TableType, number>;
    totalByArea: Record<TableArea, number>;
}

export interface TableFilter {
    search?: string;
    status?: string;
    type?: string;
    area?: string;
}

export type TableFilterParams = WithOffsetPagination<TableFilter>;