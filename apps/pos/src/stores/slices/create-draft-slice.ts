import type { StateCreator } from 'zustand';
import type { PosState, DraftSlice, LocalDraftOrder } from '../types';
import type { CartItem } from '@/features/pos';

export const createDraftSlice: StateCreator<PosState, [], [], DraftSlice> = (set, get) => ({
    draftOrders: [],
    activeDraftId: null,
    isCreateModalOpen: false,

    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),

    createNewDraft: (formData) => {
        const { draftOrders } = get();

        // 🛠️ TÍNH SỐ THỨ TỰ ĐƠN MỚI TRÁNH TRÙNG LẶP:
        // Lấy tất cả các con số từ label "Đơn #X" hiện có
        const existingNumbers = draftOrders
            .map((d) => {
                const match = d.label?.match(/\d+/);
                return match ? parseInt(match[0], 10) : 0;
            })
            .filter((num) => !isNaN(num) && num > 0);

        // Tìm số lớn nhất hiện tại, nếu chưa có đơn nào thì bắt đầu từ 0
        const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        const nextNumber = maxNumber + 1;

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
            isCreateModalOpen: false,
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

        let nextActiveId: string | null = activeDraftId;
        let nextCart: CartItem[] = [];
        let nextTableId: string | null = null;
        let nextCustomerInfo = {};

        if (activeDraftId === draftId) {
            if (updatedDrafts.length > 0) {
                const lastDraft = updatedDrafts[updatedDrafts.length - 1]!;
                nextActiveId = lastDraft.id;
                nextCart = lastDraft.cart;
                nextTableId = lastDraft.tableId || null;
                nextCustomerInfo = lastDraft.customerInfo || {};
            } else {
                nextActiveId = null;
                nextCart = [];
                nextTableId = null;
                nextCustomerInfo = {};
            }
        }

        set({
            draftOrders: updatedDrafts,
            activeDraftId: nextActiveId,
            cart: nextCart,
            selectedTableId: nextTableId,
            customerInfo: nextCustomerInfo,
        });
    },
});