import type { StateCreator } from 'zustand';
import type { PosState, CartSlice } from '../types';
import type { CartItem } from '@/features/pos';

const getDraftLabel = (orderIndex: number, cart: CartItem[]): string => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return totalItems > 0 ? `Đơn #${orderIndex} (${totalItems} món)` : `Đơn #${orderIndex}`;
};

export const createCartSlice: StateCreator<PosState, [], [], CartSlice> = (set) => ({
    cart: [],

    addToCart: (dish) =>
        set((state) => {
            const existingIndex = state.cart.findIndex((item) => item.dish.id === dish.id);
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
                        ? { ...d, cart: updatedCart, label: getDraftLabel(index + 1, updatedCart) }
                        : d
                )
                : state.draftOrders;

            return { cart: updatedCart, draftOrders: updatedDrafts };
        }),

    updateQuantity: (dishId, delta) =>
        set((state) => {
            const updatedCart = state.cart
                .map((item) => (item.dish.id === dishId ? { ...item, quantity: item.quantity + delta } : item))
                .filter((item) => item.quantity > 0);

            const updatedDrafts = state.activeDraftId
                ? state.draftOrders.map((d, index) =>
                    d.id === state.activeDraftId
                        ? { ...d, cart: updatedCart, label: getDraftLabel(index + 1, updatedCart) }
                        : d
                )
                : state.draftOrders;

            return { cart: updatedCart, draftOrders: updatedDrafts };
        }),

    updateNote: (dishId, note) =>
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.dish.id === dishId ? { ...item, note } : item
            );

            const updatedDrafts = state.activeDraftId
                ? state.draftOrders.map((d) => (d.id === state.activeDraftId ? { ...d, cart: updatedCart } : d))
                : state.draftOrders;

            return { cart: updatedCart, draftOrders: updatedDrafts };
        }),

    removeFromCart: (dishId) =>
        set((state) => {
            const updatedCart = state.cart.filter((item) => item.dish.id !== dishId);

            const updatedDrafts = state.activeDraftId
                ? state.draftOrders.map((d, index) =>
                    d.id === state.activeDraftId
                        ? { ...d, cart: updatedCart, label: getDraftLabel(index + 1, updatedCart) }
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
                        ? { ...d, cart: [], label: getDraftLabel(index + 1, []) }
                        : d
                )
                : state.draftOrders;

            return { cart: [], draftOrders: updatedDrafts };
        }),
});