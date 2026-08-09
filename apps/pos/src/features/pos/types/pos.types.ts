import { type DishResponse } from '@repo/shared-features/menu';

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