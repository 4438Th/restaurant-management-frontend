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


export enum UserStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}


export interface Role {
    name: string;
    description: string;
}

export interface UserResponse extends AuditEntity {
    id: string;
    username: string;
    fullName: string;
    status: UserStatus;
    roles: Role[];
}