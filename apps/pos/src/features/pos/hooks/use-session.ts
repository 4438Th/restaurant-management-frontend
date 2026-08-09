import { useMemo } from "react";
import { toast } from "sonner";
import { useOrders, OrderStatus, type OrderResponse } from "@repo/shared-features/order";
import { useTable } from "@repo/shared-features/tables"; // Sửa lại thành useTable
import { usePosStore } from "@/stores";
import type { OpenOrder, CreateOrderFormData } from "@/features/pos";

export function useSession() {
    // Global State từ Zustand POS Store
    const draftOrders = usePosStore((state) => state.draftOrders);
    const activeDraftId = usePosStore((state) => state.activeDraftId);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const isCreateModalOpen = usePosStore((state) => state.isCreateModalOpen);

    const openCreateModal = usePosStore((state) => state.openCreateModal);
    const closeCreateModal = usePosStore((state) => state.closeCreateModal);
    const selectDraft = usePosStore((state) => state.selectDraft);
    const createNewDraft = usePosStore((state) => state.createNewDraft);
    const closeDraft = usePosStore((state) => state.closeDraft);
    const setActiveOrder = usePosStore((state) => state.setActiveOrder);
    const resetCartAndOrder = usePosStore((state) => state.resetCartAndOrder);

    // Fetch dữ liệu từ Server
    const { data: ordersPage, isLoading: isOrdersLoading } = useOrders({
        status: OrderStatus.DRAFT,
    });
    const { data: tablesData, isLoading: isTablesLoading } = useTable();

    const serverList = useMemo(() => ordersPage?.data || [], [ordersPage]);
    const rawTables = useMemo(() => tablesData?.data || [], [tablesData]);

    /**
     * Kỹ thuật Local Hold (Client-side Table Filtering):
     * Loại bỏ các bàn đã được xí chỗ trong mảng draftOrders hiện tại ở FE.
     */
    const availableTables = useMemo(() => {
        const occupiedTableIdsInDrafts = new Set(
            draftOrders
                .map((d) => d.tableId)
                .filter((id): id is string => Boolean(id))
        );

        return rawTables.filter((table) => !occupiedTableIdsInDrafts.has(table.id));
    }, [rawTables, draftOrders]);

    // Gom danh sách Tab hiển thị trên Header Navigation
    const openOrders: OpenOrder[] = useMemo(() => {
        const draftTabs: OpenOrder[] = draftOrders.map((d) => ({
            id: d.id,
            orderCode: d.label || "Đơn mới",
            itemCount: d.cart.reduce((sum, i) => sum + i.quantity, 0),
        }));

        const serverTabs: OpenOrder[] = serverList.map((ord: OrderResponse) => ({
            id: ord.id,
            tableName: ord.tableName || (ord.tableId ? `Bàn ${ord.tableId}` : undefined),
            orderCode: `#${ord.id.slice(-4).toUpperCase()}`,
            itemCount: ord.items?.length || 0,
        }));

        return [...draftTabs, ...serverTabs];
    }, [draftOrders, serverList]);

    const activeTabId = activeOrderId || activeDraftId || undefined;

    const handleSelectTab = (tabId: string) => {
        if (tabId.startsWith("draft-")) {
            selectDraft(tabId);
        } else {
            const targetOrder = serverList.find((ord) => ord.id === tabId);

            if (targetOrder) {
                setActiveOrder({
                    id: targetOrder.id,
                    tableId: targetOrder.tableId,
                    tableName: targetOrder.tableName,
                    items: targetOrder.items,
                });
            } else {
                setActiveOrder({ id: tabId });
            }
        }
    };

    const handleCloseTab = (tabId: string) => {
        if (tabId.startsWith("draft-")) {
            closeDraft(tabId);
        } else {
            toast.warning("Đơn hàng trên hệ thống không thể đóng trực tiếp. Hãy thực hiện thanh toán hoặc hủy đơn.");
        }
    };

    /**
     * Submit từ Modal -> Thực hiện tạo Tab nháp mới
     */
    const handleCreateOrderSubmit = (formData: CreateOrderFormData) => {
        createNewDraft(formData);
        toast.success("Tạo đơn nháp mới thành công!");
    };

    return {
        // States
        openOrders,
        activeTabId,
        activeOrderId,
        activeDraftId,
        isOrdersLoading,
        tables: availableTables, // Trả về danh sách bàn đã lọc các bàn bị giữ chỗ
        isTablesLoading,
        isCreateModalOpen,

        // Handlers
        handleSelectTab,
        handleCloseTab,
        handleOpenCreateModal: openCreateModal,
        handleCloseCreateModal: closeCreateModal,
        handleCreateOrderSubmit,
        resetSession: resetCartAndOrder,
    };
}