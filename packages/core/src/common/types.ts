// Audit Base Interface
export interface AuditEntity {
    createdAt: string;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
    deletedAt?: string | null;
    deletedBy?: string | null;
}

// Global API Wrapper
export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

// Offset-based Pagination Types
export interface OffsetPageParams {
    page?: number;     // Default BE: 1
    size?: number;     // Default BE: 10
    sortBy?: string;   // Default BE: "createdAt"
    direction?: 'asc' | 'desc' | 'ASC' | 'DESC'; // Default BE: "desc"
}

export type WithOffsetPagination<T = {}> = OffsetPageParams & T;

export interface OffsetPageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    hasNext?: boolean | null;
    hasPrevious?: boolean | null;
    nextPage?: number | null;
    previousPage?: number | null;
    data: T[];
}

// Cursor-based Pagination Types
export interface CursorPageParams {
    cursor?: string | null;
    size?: number;
    direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export type WithCursorPagination<T = {}> = CursorPageParams & T;

export interface CursorPageResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasNext: boolean;
}