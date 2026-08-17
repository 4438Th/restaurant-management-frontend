import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useOrders, OrderStatus, type OrderResponse } from "@repo/shared-features/order";
import { useTable } from "@repo/shared-features/tables";
import { usePosStore } from "@/stores";
import type { OpenOrder, CreateOrderFormData } from "@/features/pos";

export function useSession() {
    // Global State từ Zustand POS Store
    const draftOrders = usePosStore((state) => state.draftOrders);
    const activeDraftId = usePosStore((state) => state.activeDraftId);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const selectedTableId = usePosStore((state) => state.selectedTableId);
    const isCreateModalOpen = usePosStore((state) => state.isCreateModalOpen);

    const openCreateModal = usePosStore((state) => state.openCreateModal);
    const closeCreateModal = usePosStore((state) => state.closeCreateModal);
    const selectDraft = usePosStore((state) => state.selectDraft);
    const createNewDraft = usePosStore((state) => state.createNewDraft);
    const closeDraft = usePosStore((state) => state.closeDraft);
    const setActiveOrder = usePosStore((state) => state.setActiveOrder);
    const resetCartAndOrder = usePosStore((state) => state.resetCartAndOrder);

    // Fetch danh sách đơn DRAFT chính thức trên Server (BE tự động loại bỏ PREORDER)
    const { data: ordersPage, isLoading: isOrdersLoading } = useOrders();

    // Fetch thông tin Order riêng cho bàn đang chọn (Dùng khi vừa bấm Check-in xong)
    const { data: tableOrdersData } = useOrders(
        selectedTableId ? { tableId: selectedTableId, page: 1, size: 1 } : undefined
    );

    const { data: tablesData, isLoading: isTablesLoading } = useTable({ page: 1, size: 100 });

    /**
     * Lọc thêm ở Client để đảm bảo an toàn tuyệt đối:
     * Bỏ qua bất kỳ Order nào vẫn đang mang status là PREORDER (nếu BE lỡ trả về chung)
     */
    const serverList = useMemo(() => {
        const rawList = ordersPage?.data || [];
        return rawList.filter((ord: OrderResponse) => {
            const isAllowedStatus =
                ord.status === OrderStatus.DRAFT ||
                ord.status === OrderStatus.PROCESSING

            return isAllowedStatus && Boolean(ord.tableId);
        });
    }, [ordersPage]);

    const rawTables = useMemo(() => tablesData?.data || [], [tablesData]);

    /**
     * Tự động đồng bộ Active Order khi selectedTableId thay đổi (Sau khi Check-in)
     */
    useEffect(() => {
        if (selectedTableId && tableOrdersData?.data && tableOrdersData.data.length > 0) {
            const currentTableOrder = tableOrdersData.data[0];

            // Chỉ active nếu đơn đã chuyển sang DRAFT/được kích hoạt (Không active đơn PRE_ORDER)
            if (currentTableOrder.status !== OrderStatus.PRE_ORDER) {
                setActiveOrder({
                    id: currentTableOrder.id,
                    tableId: currentTableOrder.tableId,
                    tableName: currentTableOrder.tableName,
                    items: currentTableOrder.items || [],
                });
            }
        }
    }, [selectedTableId, tableOrdersData, setActiveOrder]);

    /**
     * Kỹ thuật Local Hold: Loại bỏ các bàn đã giữ chỗ ở Draft Local
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
        // 1. Tab từ nháp Local
        const draftTabs: OpenOrder[] = draftOrders.map((d) => ({
            id: d.id,
            orderCode: d.label || "Đơn mới",
            itemCount: d.cart.reduce((sum, i) => sum + i.quantity, 0),
        }));

        // 2. Tab từ Server List (Đã lọc bỏ các đơn PREORDER)
        const serverTabs: OpenOrder[] = serverList.map((ord: OrderResponse) => ({
            id: ord.id,
            tableName: ord.tableName || (ord.tableId ? `Bàn ${ord.tableId}` : undefined),
            orderCode: `#${ord.id.slice(-4).toUpperCase()}`,
            itemCount: ord.items?.length || 0,
        }));

        // Hợp nhất danh sách
        const combined = [...draftTabs, ...serverTabs];

        // 3. Chỉ đẩy Active Order vào Tab Bar nếu đơn đó không thuộc dạng PREORDER
        if (activeOrderId && !combined.some((tab) => tab.id === activeOrderId)) {
            const activeTableOrder = tableOrdersData?.data?.find((o) => o.id === activeOrderId);

            if (activeTableOrder && activeTableOrder.status !== OrderStatus.PRE_ORDER) {
                combined.push({
                    id: activeOrderId,
                    tableName: activeTableOrder.tableName || (selectedTableId ? `Bàn ${selectedTableId}` : "Đơn hiện tại"),
                    orderCode: `#${activeOrderId.slice(-4).toUpperCase()}`,
                    itemCount: activeTableOrder.items?.length || 0,
                });
            }
        }

        return combined;
    }, [draftOrders, serverList, activeOrderId, selectedTableId, tableOrdersData]);

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
            const targetDraft = draftOrders.find((d) => d.id === tabId);
            const hasItems = targetDraft && targetDraft.cart.length > 0;

            if (hasItems) {
                toast.warning("Đơn nháp có chứa món ăn!", {
                    description: "Bạn có chắc chắn muốn đóng và xóa đơn này không?",
                    action: {
                        label: "Xác nhận xóa",
                        onClick: () => closeDraft(tabId),
                    },
                    classNames: {
                        actionButton: "!bg-red-500 !text-white hover:!bg-red-600 font-bold",
                    },
                });
                return;
            }

            closeDraft(tabId);
        } else {
            toast.warning("Đơn hàng trên hệ thống không thể đóng trực tiếp. Hãy thực hiện thanh toán hoặc hủy đơn.");
        }
    };

    const handleCreateOrderSubmit = (formData: CreateOrderFormData) => {
        createNewDraft(formData);
        closeCreateModal();
        toast.success("Tạo đơn nháp mới thành công!");
    };

    return {
        // States
        openOrders,
        activeTabId,
        activeOrderId,
        activeDraftId,
        isOrdersLoading,
        tables: availableTables,
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