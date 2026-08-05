import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { DishResponse } from '@repo/shared-features/menu';
import type { CartItem } from '@/features/pos';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD';

export interface PosState {
    // State
    cart: CartItem[];
    selectedTableId: string | null;
    selectedCategoryId: string;
    searchQuery: string;
    paymentMethod: PaymentMethod;
    discountPercentage: number;

    // Actions - Cart
    addToCart: (dish: DishResponse) => void;
    updateQuantity: (dishId: string, delta: number) => void;
    updateNote: (dishId: string, note: string) => void;
    removeFromCart: (dishId: string) => void;
    clearCart: () => void;

    // Actions - POS UI & Order State
    setSelectedTableId: (tableId: string | null) => void;
    setSelectedCategoryId: (categoryId: string) => void;
    setSearchQuery: (query: string) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setDiscountPercentage: (discount: number) => void;
    resetPosState: () => void;
}

export const usePosStore = create<PosState>()(
    devtools(
        persist(
            (set) => ({
                // Initial States
                cart: [],
                selectedTableId: null,
                selectedCategoryId: 'ALL',
                searchQuery: '',
                paymentMethod: 'CASH',
                discountPercentage: 0,

                // Cart Handlers
                addToCart: (dish: DishResponse) =>
                    set((state: PosState) => {
                        const existingIndex = state.cart.findIndex(
                            (item: CartItem) => item.dish.id === dish.id
                        );

                        if (existingIndex > -1) {
                            const updatedCart = [...state.cart];
                            const existingItem = updatedCart[existingIndex];
                            if (existingItem) {
                                updatedCart[existingIndex] = {
                                    ...existingItem,
                                    quantity: existingItem.quantity + 1,
                                };
                            }
                            return { cart: updatedCart };
                        }

                        return { cart: [...state.cart, { dish, quantity: 1 }] };
                    }),

                updateQuantity: (dishId: string, delta: number) =>
                    set((state: PosState) => ({
                        cart: state.cart
                            .map((item: CartItem) =>
                                item.dish.id === dishId
                                    ? { ...item, quantity: item.quantity + delta }
                                    : item
                            )
                            .filter((item: CartItem) => item.quantity > 0),
                    })),

                updateNote: (dishId: string, note: string) =>
                    set((state: PosState) => ({
                        cart: state.cart.map((item: CartItem) =>
                            item.dish.id === dishId ? { ...item, note } : item
                        ),
                    })),

                removeFromCart: (dishId: string) =>
                    set((state: PosState) => ({
                        cart: state.cart.filter((item: CartItem) => item.dish.id !== dishId),
                    })),

                clearCart: () => set({ cart: [] }),

                // POS UI & Order Handlers
                setSelectedTableId: (tableId: string | null) => set({ selectedTableId: tableId }),
                setSelectedCategoryId: (categoryId: string) =>
                    set({ selectedCategoryId: categoryId }),
                setSearchQuery: (query: string) => set({ searchQuery: query }),
                setPaymentMethod: (method: PaymentMethod) => set({ paymentMethod: method }),
                setDiscountPercentage: (discount: number) =>
                    set({ discountPercentage: discount }),

                resetPosState: () =>
                    set({
                        cart: [],
                        selectedTableId: null,
                        selectedCategoryId: 'ALL',
                        searchQuery: '',
                        paymentMethod: 'CASH',
                        discountPercentage: 0,
                    }),
            }),
            {
                name: 'pos-cart-storage',
                partialize: (state: PosState) => ({
                    cart: state.cart,
                    selectedTableId: state.selectedTableId,
                }),
            }
        )
    )
);