import { AuditEntity, WithOffsetPagination } from "@repo/core";

export enum DishStatus {
    AVAILABLE = 'Đang bán',
    ARCHIVED = 'Lưu trữ',
    OUT_OF_STOCK = 'Tạm hết món',
    DISCONTINUED = 'Ngừng bán',
    DELETED = 'Đã xóa',
}
export const DishStatusLabel: Record<string, string> = {
    'AVAILABLE': DishStatus.AVAILABLE,
    'ARCHIVED': DishStatus.ARCHIVED,
    'OUT_OF_STOCK': DishStatus.OUT_OF_STOCK,
    'DISCONTINUED': DishStatus.DISCONTINUED,
    'DELETED': DishStatus.DELETED,
};
export enum DishType {
    FOOD = 'Đồ ăn',
    BEVERAGE = 'Đồ uống',
    OTHER = 'Khác'
}
export const DishTypeLabel: Record<string, string> = {
    'FOOD': DishType.FOOD,
    'BEVERAGE': DishType.BEVERAGE,
    'OTHER': DishType.OTHER,
};
export enum MenuCategoryStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const MenuCategoryStatusLabel: Record<string, string> = {
    'DRAFT': 'Bản nháp',
    'ACTIVE': 'Hoạt động',
    'INACTIVE': 'Tạm ẩn',
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
export interface DishCreateRequest {
    dishName: string;
    description: string;
    price: string;
    imageUrl: string;
    unit: string;
    type: DishType;
    categoryId: string;
}
export interface DishUpdateRequest {
    dishName: string;
    description: string;
    price: string;
    imageUrl: string;
    unit: string;
    type: DishType;
    categoryId: string;
    status: DishStatus;
}
export interface DishResponse extends AuditEntity {
    id: string;
    dishName: string;
    description: string;
    price: string;
    status: DishStatus;
    imageUrl: string;
    unit: string;
    type: DishType;
    category: MenuCategoryInfo;
}
export interface MenuCategoryInfo extends AuditEntity {
    id: string;
    categoryName: string;
}
export interface DishAnalyticsResponse {
    totalDishes: number;
    totalByStatus: Record<DishStatus, number>;
    totalByType: Record<DishType, number>;
}
export interface MenuCategoryFilter {
    search?: string;
    status?: string;
}

export type MenuCategoryFilterParams = WithOffsetPagination<MenuCategoryFilter>;

export interface DishFilter {
    search?: string;
    status?: string;
    type?: string;
    categoryId?: string;
}

export type DishFilterParams = WithOffsetPagination<DishFilter>;