import { AuditEntity } from "@repo/core";

export enum DishStatus {
    ARCHIVED = 'ARCHIVED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED',
    DELETED = 'DELETED',
}
export enum MenuCategoryStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}
export enum DishType {
    FOOD = 'FOOD',
    BEVERAGE = 'BEVERAGE',
    OTHER = 'OTHER'
}
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
    itemName: string;
    description: string;
    price: string;
    imageUrl: string;
    unit: string;
    type: DishType;
    categoryId: string;
}
export interface DishUpdateRequest {
    itemName: string;
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
    itemName: string;
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


