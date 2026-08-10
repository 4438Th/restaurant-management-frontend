import { type StateCreator } from 'zustand';
import type { PosState, UiSlice } from '../types';

export const createUiSlice: StateCreator<PosState, [], [], UiSlice> = (set) => ({
    selectedTableId: null,
    customerInfo: {},
    selectedCategoryId: 'ALL',
    searchQuery: '',
    paymentMethod: 'CASH',
    discountPercentage: 0,

    setSelectedTableId: (tableId) => set({ selectedTableId: tableId }),

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
        set({
            cart: [],
            activeOrderId: null,
            activeOrderItems: [],
            selectedTableId: null,
            customerInfo: {},
            discountPercentage: 0,
        }),

    resetPosState: () =>
        set({
            draftOrders: [],
            openOrders: [],
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
});