import { AuditEntity } from "@repo/core";

export enum MenuItemStatus {
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
export enum MenuItemType {
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
export interface MenuItemCreateRequest {
    itemName: string;
    description: string;
    price: string;
    imageUrl: string;
    unit: string;
    type: MenuItemType;
    categoryId: string;
}
export interface MenuItemUpdateRequest {
    itemName: string;
    description: string;
    price: string;
    imageUrl: string;
    unit: string;
    type: MenuItemType;
    categoryId: string;
    status: MenuItemStatus;
}
export interface MenuItemResponse extends AuditEntity {
    id: string;
    itemName: string;
    description: string;
    status: MenuItemStatus;
    imageUrl: string;
    unit: string;
    type: MenuItemType;
    category: MenuCategoryInfo;
}
export interface MenuCategoryInfo extends AuditEntity {
    id: string;
    categoryName: string;
}


