import type { StateCreator } from 'zustand';
import type { PosState, DraftSlice, LocalDraftOrder } from '../types';
import type { CartItem } from '@/features/pos';

export const createDraftSlice: StateCreator<PosState, [], [], DraftSlice> = (set, get) => ({
    draftOrders: [{ id: 'draft-1', label: 'Đơn #1', cart: [] }],
    activeDraftId: 'draft-1',

    createNewDraft: (formData) => {
        const { draftOrders } = get();
        const nextNumber = draftOrders.length + 1;
        const newDraft: LocalDraftOrder = {
            id: `draft-${Date.now()}`,
            label: `Đơn #${nextNumber}`,
            cart: [],
            tableId: formData?.tableId,
            customerInfo: {
                customerName: formData?.customerName,
                customerPhone: formData?.customerPhone,
            },
        };

        set({
            draftOrders: [...draftOrders, newDraft],
            activeDraftId: newDraft.id,
            activeOrderId: null,
            activeOrderItems: [],
            cart: [],
            selectedTableId: formData?.tableId || null,
            customerInfo: newDraft.customerInfo || {},
        });

        return newDraft.id;
    },

    createDraftOrder: (formData) => {
        return get().createNewDraft(formData);
    },

    updateDraftTableInfo: (draftId, formData) => {
        set((state) => {
            const updatedDrafts = state.draftOrders.map((d) => {
                if (d.id !== draftId) return d;
                return {
                    ...d,
                    tableId: formData.tableId ?? d.tableId,
                    customerInfo: {
                        ...d.customerInfo,
                        customerName: formData.customerName ?? d.customerInfo?.customerName,
                        customerPhone: formData.customerPhone ?? d.customerInfo?.customerPhone,
                    },
                };
            });

            return {
                draftOrders: updatedDrafts,
                selectedTableId:
                    draftId === state.activeDraftId
                        ? (formData.tableId ?? state.selectedTableId)
                        : state.selectedTableId,
            };
        });
    },

    selectDraft: (draftId) => {
        const { draftOrders } = get();
        const draft = draftOrders.find((d) => d.id === draftId);

        set({
            activeDraftId: draftId,
            activeOrderId: null,
            activeOrderItems: [],
            cart: draft ? draft.cart : [],
            selectedTableId: draft?.tableId || null,
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
});