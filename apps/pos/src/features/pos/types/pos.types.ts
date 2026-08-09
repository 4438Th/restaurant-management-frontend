import { type DishResponse } from '@repo/shared-features/menu';
import { type OrderItemResponse } from '@repo/shared-features/order';

export interface CartItem {
    dish: DishResponse;
    quantity: number;
    note?: string;
}

export type SelectedCategory = 'ALL' | string;

export interface OpenOrder {
    id: string;
    tableName?: string;
    orderCode?: string;
    itemCount: number;
}

export interface PaymentOrderDetail {
    id: string;
    items?: OrderItemResponse[];
    orderDetails?: OrderItemResponse[];
    tableId?: string;
    tableName?: string;
    totalAmount?: number | string;
}