// packages/core/src/common/types.ts

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
    data: T[];
}

export interface AuditEntity {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
    deletedBy: string | null;
}