import { AuditEntity, WithOffsetPagination } from "@repo/core";
export enum DishStatus {
    AVAILABLE = 'AVAILABLE',
    ARCHIVED = 'ARCHIVED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED',
    DELETED = 'DELETED',
}
export const DishStatusLabel: Record<DishStatus, string> = {
    [DishStatus.AVAILABLE]: 'Đang bán',
    [DishStatus.ARCHIVED]: 'Lưu trữ',
    [DishStatus.OUT_OF_STOCK]: 'Tạm hết món',
    [DishStatus.DISCONTINUED]: 'Ngừng bán',
    [DishStatus.DELETED]: 'Đã xóa',
};
export enum DishType {
    FOOD = 'FOOD',
    BEVERAGE = 'BEVERAGE',
    OTHER = 'OTHER'
}
export const DishTypeLabel: Record<DishType, string> = {
    [DishType.FOOD]: 'Đồ ăn',
    [DishType.BEVERAGE]: 'Đồ uống',
    [DishType.OTHER]: 'Khác',
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