export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;

    nextPageUrl?: string;
    previousPageUrl?: string;

    data: T[];
}