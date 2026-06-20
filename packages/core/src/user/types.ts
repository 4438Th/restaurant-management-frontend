export type UserStatus =
    | "PENDING"
    | "ACTIVE"
    | "INACTIVE";

export interface User {
    id: string;

    username: string;
    fullName: string;

    status: UserStatus;

    roles: string[];
    permissions: string[];

    createdAt?: string;
    createdBy?: string;

    updatedAt?: string;
    updatedBy?: string;

    deletedAt?: string;
    deletedBy?: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    fullName: string;
    roles: string[];
}

export interface UpdateUserRequest {
    password?: string;
    fullName?: string;
}

export interface AssignRolesRequest {
    user: string;
    roles: string[];
}

export interface RemoveRolesRequest {
    user: string;
    roles: string[];
}