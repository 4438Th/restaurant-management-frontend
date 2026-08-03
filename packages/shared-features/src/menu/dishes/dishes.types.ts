import { AuditEntity, WithOffsetPagination } from "@repo/core";
export enum DishStatus {
    AVAILABLE = 'AVAILABLE',
    ARCHIVED = 'ARCHIVED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED',
    DELETED = 'DELETED',
}
export const DishStatusLabel: Record<string, string> = {
    'Đang bán': DishStatus.AVAILABLE,
    'Lưu trữ': DishStatus.ARCHIVED,
    'Tạm hết món': DishStatus.OUT_OF_STOCK,
    'Ngừng bán': DishStatus.DISCONTINUED,
    'Đã xóa': DishStatus.DELETED,
};
export enum DishType {
    FOOD = 'FOOD',
    BEVERAGE = 'BEVERAGE',
    OTHER = 'OTHER'
}
export const DishTypeLabel: Record<string, string> = {
    'Đồ ăn': DishType.FOOD,
    'Đồ uống': DishType.BEVERAGE,
    'Khác': DishType.OTHER,
};
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
export interface DishFilter {
    search?: string;
    status?: string;
    type?: string;
    categoryId?: string;
}

export type DishFilterParams = WithOffsetPagination<DishFilter>;