import { useMemo } from "react";
import { toast } from "sonner";
import { useOrders, OrderStatus, type OrderResponse } from "@repo/shared-features/order";
import { usePosStore } from "@/stores";
import type { OpenOrder } from "@/features/pos";

export function usePosTabs() {
    const draftOrders = usePosStore((state) => state.draftOrders);
    const activeDraftId = usePosStore((state) => state.activeDraftId);
    const activeOrderId = usePosStore((state) => state.activeOrderId);

    const selectDraft = usePosStore((state) => state.selectDraft);
    const createNewDraft = usePosStore((state) => state.createNewDraft);
    const closeDraft = usePosStore((state) => state.closeDraft);
    const setActiveOrder = usePosStore((state) => state.setActiveOrder);

    // Fetch danh sách đơn hàng đang chế biến từ Server
    const { data: ordersPage } = useOrders({
        status: OrderStatus.DRAFT,
    });

    const serverList = useMemo(() => ordersPage?.data || [], [ordersPage]);

    const openOrders: OpenOrder[] = useMemo(() => {
        const draftTabs: OpenOrder[] = draftOrders.map((d) => ({
            id: d.id,
            orderCode: d.label,
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

    const handleSelectTab = (tabId: string) => {
        if (tabId.startsWith("draft-")) {
            selectDraft(tabId);
        } else {
            // Tìm order tương ứng trong serverList để lấy đầy đủ thông tin
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
            toast.warning("Đơn hàng đang phục vụ không thể đóng trực tiếp.");
        }
    };

    return {
        openOrders,
        activeTabId: activeOrderId || activeDraftId || undefined,
        handleSelectTab,
        handleCloseTab,
        handleCreateDraft: createNewDraft,
    };
}