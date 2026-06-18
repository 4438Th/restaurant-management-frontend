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
export interface TokenInfo {
    tokenValue: string;
    expiryTime: string;
}