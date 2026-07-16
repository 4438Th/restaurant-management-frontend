export interface AuditEntity {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
    deletedBy: string | null;
}
export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}
export interface OffsetPageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextPage: number | null;
    previousPage: number | null;
    data: T[];
}
export interface OffsetPageParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
}
export type WithOffsetPagination<T> = OffsetPageParams & T;
export interface CursorPageResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasNext: boolean;
}
export interface CursorPageParams {
    size?: number;
    lastId?: string;
    lastCreatedAt?: string;
    direction?: 'asc' | 'desc' | 'ASC' | 'DESC';
}
export type WithCursorPagination<T> = CursorPageParams & T;

export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
    data: T[];
}