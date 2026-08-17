import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { PosState } from './types';
import { createDraftSlice } from './slices/create-draft-slice';
import { createCartSlice } from './slices/create-cart-slice';
import { createOrderSlice } from './slices/create-order-slice';
import { createUiSlice } from './slices/create-ui-slice';

export * from './types';

export const usePosStore = create<PosState>()(
    devtools(
        persist(
            (...a) => ({
                ...createDraftSlice(...a),
                ...createCartSlice(...a),
                ...createOrderSlice(...a),
                ...createUiSlice(...a),
            }),
            {
                name: 'pos-cart-storage',
                partialize: (state) => ({
                    draftOrders: state.draftOrders,
                    openOrders: state.openOrders,
                    activeDraftId: state.activeDraftId,
                    cart: state.cart,
                    selectedTableId: state.selectedTableId,
                    activeOrderId: state.activeOrderId,
                    customerInfo: state.customerInfo,
                }),
                onRehydrateStorage: () => (state) => {
                    if (state && state.activeDraftId) {
                        const activeDraft = state.draftOrders.find((d) => d.id === state.activeDraftId);
                        if (activeDraft) {
                            state.cart = activeDraft.cart;
                            state.customerInfo = activeDraft.customerInfo || {};
                            state.selectedTableId = activeDraft.tableId || null;
                        }
                    }
                },
            }
        )
    )
);