import { AuditEntity, WithOffsetPagination } from "@repo/core";

export enum UserStatus {
    PENDING = 'Chờ duyệt',
    ACTIVE = 'Đang hoạt động',
    INACTIVE = 'Không hoạt động',
    DELETED = 'Đã xóa',
}

export const UserStatusLabel: Record<string, string> = {
    'PENDING': UserStatus.PENDING,
    'ACTIVE': UserStatus.ACTIVE,
    'INACTIVE': UserStatus.INACTIVE,
    'DELETED': UserStatus.DELETED,
}

export enum UserRoles {
    MANAGER = "Quản lý",
    CHEF = "Bếp",
    WAITER = "Phục vụ",
    BAR = "Bar",
    CASHIER = "Thu ngân",
}

export const UserRolesLabel: Record<string, string> = {
    'MANAGER': UserRoles.MANAGER,
    'CHEF': UserRoles.CHEF,
    'WAITER': UserRoles.WAITER,
    'BAR': UserRoles.BAR,
    'CASHIER': UserRoles.CASHIER,
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
export interface UserFilter {
    search?: string;
    status?: string;
    role?: string;
}
export type UserFilterParams = WithOffsetPagination<UserFilter>;
export type User = UserResponse;