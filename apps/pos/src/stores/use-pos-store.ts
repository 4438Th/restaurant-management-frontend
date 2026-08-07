import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
    customerInfo?: PosCustomerInfo;
}

// Helper tính toán label hiển thị động theo số lượng món
const getDraftLabel = (orderIndex: number, cart: CartItem[]): string => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems > 0 ? `Đơn #${orderIndex} (${totalItems} món)` : `Đơn #${orderIndex}`;
};

export interface PosState {
    draftOrders: LocalDraftOrder[];
    activeDraftId: string | null;
    activeOrderId: string | null;
    activeOrderItems: OrderItemResponse[];

    cart: CartItem[];

    selectedTableId: string | null;
    customerInfo: PosCustomerInfo;
    selectedCategoryId: string;
    searchQuery: string;
    paymentMethod: PaymentMethod;
    discountPercentage: number;

    createNewDraft: () => string;
    selectDraft: (draftId: string) => void;
    closeDraft: (draftId: string) => void;

    addToCart: (dish: DishResponse) => void;
    updateQuantity: (dishId: string, delta: number) => void;
    updateNote: (dishId: string, note: string) => void;
    removeFromCart: (dishId: string) => void;
    clearCart: () => void;

    setSelectedTableId: (tableId: string | null) => void;
    setActiveOrder: (orderId: string | null, existingItems?: OrderItemResponse[]) => void;
    setCustomerInfo: (info: Partial<PosCustomerInfo>) => void;
    setSelectedCategoryId: (categoryId: string) => void;
    setSearchQuery: (query: string) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setDiscountPercentage: (discount: number) => void;

    resetCartAndOrder: () => void;
    resetPosState: () => void;
}

export const usePosStore = create<PosState>()(
    devtools(
        persist(
            (set, get) => ({
                draftOrders: [{ id: 'draft-1', label: 'Đơn #1', cart: [] }],
                activeDraftId: 'draft-1',
                activeOrderId: null,
                activeOrderItems: [],
                cart: [],

                selectedTableId: null,
                customerInfo: {},
                selectedCategoryId: 'ALL',
                searchQuery: '',
                paymentMethod: 'CASH',
                discountPercentage: 0,

                // ------------------------------------------
                // Draft Handlers
                // ------------------------------------------
                createNewDraft: () => {
                    const { draftOrders } = get();
                    const nextNumber = draftOrders.length + 1;
                    const newDraft: LocalDraftOrder = {
                        id: `draft-${Date.now()}`,
                        label: `Đơn #${nextNumber}`,
                        cart: [],
                    };

                    set({
                        draftOrders: [...draftOrders, newDraft],
                        activeDraftId: newDraft.id,
                        activeOrderId: null,
                        activeOrderItems: [],
                        cart: [],
                    });

                    return newDraft.id;
                },

                selectDraft: (draftId) => {
                    const { draftOrders } = get();
                    const draft = draftOrders.find((d) => d.id === draftId);

                    set({
                        activeDraftId: draftId,
                        activeOrderId: null,
                        activeOrderItems: [],
                        cart: draft ? draft.cart : [],
                        customerInfo: draft?.customerInfo || {},
                    });
                },

                closeDraft: (draftId) => {
                    const { draftOrders, activeDraftId } = get();
                    const updatedDrafts = draftOrders.filter((d) => d.id !== draftId);

                    let nextActiveId = activeDraftId;
                    let nextCart: CartItem[] = [];

                    if (activeDraftId === draftId) {
                        if (updatedDrafts.length > 0) {
                            const lastDraft = updatedDrafts[updatedDrafts.length - 1]!;
                            nextActiveId = lastDraft.id;
                            nextCart = lastDraft.cart;
                        } else {
                            const defaultDraft = {
                                id: `draft-${Date.now()}`,
                                label: 'Đơn #1',
                                cart: [],
                            };
                            updatedDrafts.push(defaultDraft);
                            nextActiveId = defaultDraft.id;
                            nextCart = [];
                        }
                    }

                    set({
                        draftOrders: updatedDrafts,
                        activeDraftId: nextActiveId,
                        cart: nextCart,
                    });
                },

                // ------------------------------------------
                // Cart Handlers
                // ------------------------------------------
                addToCart: (dish: DishResponse) =>
                    set((state) => {
                        const existingIndex = state.cart.findIndex(
                            (item) => item.dish.id === dish.id
                        );
                        let updatedCart: CartItem[];

                        if (existingIndex > -1) {
                            updatedCart = [...state.cart];
                            const existingItem = updatedCart[existingIndex];
                            if (existingItem) {
                                updatedCart[existingIndex] = {
                                    ...existingItem,
                                    quantity: existingItem.quantity + 1,
                                };
                            }
                        } else {
                            updatedCart = [...state.cart, { dish, quantity: 1 }];
                        }

                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d, index) =>
                                d.id === state.activeDraftId
                                    ? {
                                        ...d,
                                        cart: updatedCart,
                                        label: getDraftLabel(index + 1, updatedCart),
                                    }
                                    : d
                            )
                            : state.draftOrders;

                        return { cart: updatedCart, draftOrders: updatedDrafts };
                    }),

                updateQuantity: (dishId: string, delta: number) =>
                    set((state) => {
                        const updatedCart = state.cart
                            .map((item) =>
                                item.dish.id === dishId
                                    ? { ...item, quantity: item.quantity + delta }
                                    : item
                            )
                            .filter((item) => item.quantity > 0);

                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d, index) =>
                                d.id === state.activeDraftId
                                    ? {
                                        ...d,
                                        cart: updatedCart,
                                        label: getDraftLabel(index + 1, updatedCart),
                                    }
                                    : d
                            )
                            : state.draftOrders;

                        return { cart: updatedCart, draftOrders: updatedDrafts };
                    }),

                updateNote: (dishId: string, note: string) =>
                    set((state) => {
                        const updatedCart = state.cart.map((item) =>
                            item.dish.id === dishId ? { ...item, note } : item
                        );

                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d) =>
                                d.id === state.activeDraftId ? { ...d, cart: updatedCart } : d
                            )
                            : state.draftOrders;

                        return { cart: updatedCart, draftOrders: updatedDrafts };
                    }),

                removeFromCart: (dishId: string) =>
                    set((state) => {
                        const updatedCart = state.cart.filter((item) => item.dish.id !== dishId);

                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d, index) =>
                                d.id === state.activeDraftId
                                    ? {
                                        ...d,
                                        cart: updatedCart,
                                        label: getDraftLabel(index + 1, updatedCart),
                                    }
                                    : d
                            )
                            : state.draftOrders;

                        return { cart: updatedCart, draftOrders: updatedDrafts };
                    }),

                clearCart: () =>
                    set((state) => {
                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d, index) =>
                                d.id === state.activeDraftId
                                    ? {
                                        ...d,
                                        cart: [],
                                        label: getDraftLabel(index + 1, []),
                                    }
                                    : d
                            )
                            : state.draftOrders;

                        return { cart: [], draftOrders: updatedDrafts };
                    }),

                // ------------------------------------------
                // POS UI & Order Handlers
                // ------------------------------------------
                setSelectedTableId: (tableId) =>
                    set({
                        selectedTableId: tableId,
                        cart: [],
                        activeOrderId: null,
                        activeOrderItems: [],
                    }),

                setActiveOrder: (orderId, existingItems = []) =>
                    set({
                        activeOrderId: orderId,
                        activeDraftId: null,
                        activeOrderItems: existingItems,
                        cart: [],
                    }),

                setCustomerInfo: (info) =>
                    set((state) => {
                        const updatedCustomerInfo = { ...state.customerInfo, ...info };
                        const updatedDrafts = state.activeDraftId
                            ? state.draftOrders.map((d) =>
                                d.id === state.activeDraftId
                                    ? { ...d, customerInfo: updatedCustomerInfo }
                                    : d
                            )
                            : state.draftOrders;

                        return {
                            customerInfo: updatedCustomerInfo,
                            draftOrders: updatedDrafts,
                        };
                    }),

                setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),
                setSearchQuery: (query) => set({ searchQuery: query }),
                setPaymentMethod: (method) => set({ paymentMethod: method }),
                setDiscountPercentage: (discount) => set({ discountPercentage: discount }),

                resetCartAndOrder: () =>
                    set((state) => {
                        let updatedDrafts = state.draftOrders;
                        let nextDraftId = state.activeDraftId;

                        if (state.activeDraftId) {
                            updatedDrafts = state.draftOrders.filter(
                                (d) => d.id !== state.activeDraftId
                            );
                            if (updatedDrafts.length > 0) {
                                nextDraftId = updatedDrafts[0]!.id;
                            } else {
                                const newDraft = {
                                    id: `draft-${Date.now()}`,
                                    label: 'Đơn #1',
                                    cart: [],
                                };
                                updatedDrafts = [newDraft];
                                nextDraftId = newDraft.id;
                            }
                        }

                        const activeDraft = updatedDrafts.find((d) => d.id === nextDraftId);

                        return {
                            cart: activeDraft ? activeDraft.cart : [],
                            draftOrders: updatedDrafts,
                            activeDraftId: nextDraftId,
                            activeOrderId: null,
                            activeOrderItems: [],
                            customerInfo: {},
                            discountPercentage: 0,
                        };
                    }),

                resetPosState: () =>
                    set({
                        draftOrders: [{ id: `draft-${Date.now()}`, label: 'Đơn #1', cart: [] }],
                        activeDraftId: null,
                        cart: [],
                        selectedTableId: null,
                        activeOrderId: null,
                        activeOrderItems: [],
                        customerInfo: {},
                        selectedCategoryId: 'ALL',
                        searchQuery: '',
                        paymentMethod: 'CASH',
                        discountPercentage: 0,
                    }),
            }),
            {
                name: 'pos-cart-storage',
                partialize: (state) => ({
                    draftOrders: state.draftOrders,
                    activeDraftId: state.activeDraftId,
                    cart: state.cart,
                    selectedTableId: state.selectedTableId,
                    activeOrderId: state.activeOrderId,
                    customerInfo: state.customerInfo,
                }),
            }
        )
    )
);