// apps/admin/src/features/users/users.types.ts
import { AuditEntity } from "@repo/core";

export enum UserStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

export interface Role {
    name: string;
    description: string;
}

export interface UserResponse extends AuditEntity {
    id: string;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dob: string;
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
    password: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dob: string;
    roles: string[];
}

export interface UserUpdateRequest {
    password?: string;
    fullName: string;
    status: UserStatus;
    email: string;
    phoneNumber: string;
    dob: string;
    roles: string[];
}

export const AVAILABLE_ROLES = [
    "MANAGER",
    "CHEF",
    "WAITER",
    "BAR",
    "CASHIER",
];
export type User = UserResponse;