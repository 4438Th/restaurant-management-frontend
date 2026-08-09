// apps/pos/src/stores/types.ts

import type { DishResponse } from '@repo/shared-features/menu';
import type { OrderItemResponse } from '@repo/shared-features/order';
import type { CartItem } from '@/features/pos';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD';

export interface PosCustomerInfo {
    customerName?: string;
    customerPhone?: string;
}

export interface LocalDraftOrder {
    id: string;
    label: string;
    cart: CartItem[];
    tableId?: string;
    customerInfo?: PosCustomerInfo;
}

export interface ServerOpenOrder {
    id: string;
    tableName?: string;
    tableId?: string;
}

export interface DraftFormData {
    tableId?: string;
    customerName?: string;
    customerPhone?: string;
}

// ------------------------------------------
// Interfaces từng Slice
// ------------------------------------------
export interface DraftSlice {
    draftOrders: LocalDraftOrder[];
    activeDraftId: string | null;
    isCreateModalOpen: boolean;
    openCreateModal: () => void; closeCreateModal: () => void;
    createNewDraft: (formData?: DraftFormData) => string;
    createDraftOrder: (formData?: DraftFormData) => string;
    updateDraftTableInfo: (draftId: string, formData: DraftFormData) => void;
    selectDraft: (draftId: string) => void;
    closeDraft: (draftId: string) => void;
}

export interface CartSlice {
    cart: CartItem[];
    addToCart: (dish: DishResponse) => void;
    updateQuantity: (dishId: string, delta: number) => void;
    updateNote: (dishId: string, note: string) => void;
    removeFromCart: (dishId: string) => void;
    clearCart: () => void;
}

export interface OrderSlice {
    openOrders: ServerOpenOrder[];
    activeOrderId: string | null;
    activeOrderItems: OrderItemResponse[];
    setActiveOrder: (order: { id: string; tableId?: string; tableName?: string; items?: OrderItemResponse[] }) => void;
    addOpenOrder: (order: ServerOpenOrder) => void;
    removeOpenOrder: (orderId: string) => void;
}

export interface UiSlice {
    selectedTableId: string | null;
    customerInfo: PosCustomerInfo;
    selectedCategoryId: string;
    searchQuery: string;
    paymentMethod: PaymentMethod;
    discountPercentage: number;

    setSelectedTableId: (tableId: string | null) => void;
    setCustomerInfo: (info: Partial<PosCustomerInfo>) => void;
    setSelectedCategoryId: (categoryId: string) => void;
    setSearchQuery: (query: string) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setDiscountPercentage: (discount: number) => void;

    resetCartAndOrder: () => void;
    resetPosState: () => void;
}

// Gộp chung thành State hoàn chỉnh của Store
export type PosState = DraftSlice & CartSlice & OrderSlice & UiSlice;