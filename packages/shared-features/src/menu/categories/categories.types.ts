import { AuditEntity, WithOffsetPagination } from "@repo/core";


export enum MenuCategoryStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

export const MenuCategoryStatusLabel: Record<MenuCategoryStatus, string> = {
    [MenuCategoryStatus.DRAFT]: 'Bản nháp',
    [MenuCategoryStatus.ACTIVE]: 'Hoạt động',
    [MenuCategoryStatus.INACTIVE]: 'Tạm ẩn',
    [MenuCategoryStatus.DELETED]: 'Đã xóa',
};
export interface MenuCategoryCreateRequest {
    categoryName: string;
    description: string;
}
export interface MenuCategoryUpdateRequest {
    categoryName: string;
    description: string;
    status: string;
}
export interface MenuCategoryResponse extends AuditEntity {
    id: string;
    categoryName: string;
    description: string;
    status: MenuCategoryStatus;
}
export interface MenuCategoryAnalyticsResponse {
    categoryId: string;
    categoryName: string;
    totalDishes: number;
}


export interface MenuCategoryFilter {
    search?: string;
    status?: string;
}

export type MenuCategoryFilterParams = WithOffsetPagination<MenuCategoryFilter>;