// apps/admin/src/features/users/users.types.ts
import { AuditEntity } from "@repo/core";

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
    roles: string[];
    permissions: string[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface UserCreateRequest {
    username: string;
    password?: string;
    fullName: string;
    roles: string[];
}

export interface UserUpdateRequest {
    password?: string;
    fullName: string;
}

export interface AssignRolesRequest {
    user: string;
    roles: string[];
}

export interface RemoveRolesRequest {
    user: string;
    roles: string[];
}

export const AVAILABLE_ROLES = [
    "MANAGER",
    "CHEF",
    "WAITER",
    "BAR",
    "CASHIER",
    "USER",
];
export type User = UserResponse;