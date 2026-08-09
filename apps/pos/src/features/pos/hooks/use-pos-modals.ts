// apps/pos/src/features/pos/hooks/use-pos-modals.ts

import { useState, useCallback } from "react";
import { usePosStore, type DraftFormData } from "@/stores/use-pos-store";
import { useTable, type TableResponse } from "@repo/shared-features/tables";

export function usePosModals() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Gọi hook lấy danh sách bàn
    const { data: tablesData, isLoading: isTablesLoading } = useTable();

    // Bóc tách danh sách bàn với Type Safety (Loại bỏ hoàn toàn 'any')
    // Giúp TypeScript hiểu đúng tables là TableResponse[]
    const tables: TableResponse[] = tablesData?.data ?? [];

    // Store Selectors
    const draftOrders = usePosStore((state) => state.draftOrders);
    const activeDraftId = usePosStore((state) => state.activeDraftId);
    const createDraftOrder = usePosStore((state) => state.createDraftOrder);
    const updateDraftTableInfo = usePosStore((state) => state.updateDraftTableInfo);

    // Lấy đơn nháp hiện tại
    const currentDraft = draftOrders.find((d) => d.id === activeDraftId);

    // Handler xác nhận tạo đơn từ Modal
    const handleConfirmCreateOrder = useCallback(
        (data: DraftFormData) => {
            const newDraftId = createDraftOrder(data);
            setIsCreateModalOpen(false);
            return newDraftId;
        },
        [createDraftOrder]
    );

    return {
        // State Modal
        isCreateModalOpen,
        setIsCreateModalOpen,
        isPaymentOpen,
        setIsPaymentOpen,

        // Dữ liệu bàn & Trạng thái Loading
        tables,
        isTablesLoading,
        isSubmitting: false,

        // Thông tin đơn nháp hiện tại
        currentDraft,
        activeDraftId,

        // Actions
        handleConfirmCreateOrder,
        updateDraftTableInfo,
    };
}