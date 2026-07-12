import { AuditEntity } from "@repo/core";

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
    DRAFT = 'Bản nháp',
    ACTIVE = 'Đang hoạt động',
    INACTIVE = 'Không hoạt động',
    DELETED = 'Đã xóa',
}
export const MenuCategoryStatusLabel: Record<string, string> = {
    'DRAFT': MenuCategoryStatus.DRAFT,
    'ACTIVE': MenuCategoryStatus.ACTIVE,
    'INACTIVE': MenuCategoryStatus.INACTIVE,
    'DELETED': MenuCategoryStatus.DELETED
};
export interface MenuCategoryCreateRequest {
    categoryName: string;
    description: string;
}
export interface MenuCategoryUpdateRequest {
    categoryName: string;
    description: string;
    status: MenuCategoryStatus;
}
export interface MenuCategoryResponse extends AuditEntity {
    id: string;
    categoryName: string;
    description: string;
    status: MenuCategoryStatus;
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


