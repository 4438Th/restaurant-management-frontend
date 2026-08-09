import { type StateCreator } from 'zustand';
import type { PosState, OrderSlice } from '../types';

export const createOrderSlice: StateCreator<PosState, [], [], OrderSlice> = (set) => ({
    openOrders: [],
    activeOrderId: null,
    activeOrderItems: [],

    setActiveOrder: ({ id, tableId, tableName, items = [] }) =>
        set((state) => {
            const exists = state.openOrders.some((o) => o.id === id);
            const updatedOpenOrders = exists
                ? state.openOrders
                : [...state.openOrders, { id, tableId, tableName }];

            return {
                activeOrderId: id,
                activeDraftId: null,
                activeOrderItems: items,
                selectedTableId: tableId ?? state.selectedTableId,
                cart: [],
                openOrders: updatedOpenOrders,
            };
        }),

    addOpenOrder: (order) =>
        set((state) => ({
            openOrders: state.openOrders.some((o) => o.id === order.id)
                ? state.openOrders
                : [...state.openOrders, order],
        })),

    removeOpenOrder: (orderId) =>
        set((state) => ({
            openOrders: state.openOrders.filter((o) => o.id !== orderId),
            activeOrderId: state.activeOrderId === orderId ? null : state.activeOrderId,
        })),
});