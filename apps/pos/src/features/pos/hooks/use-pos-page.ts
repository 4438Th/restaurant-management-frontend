// apps/pos/src/features/pos/hooks/use-pos-page.ts

import { usePosStore, type DraftFormData } from "@/stores";
import { useOrderDetail } from "@repo/shared-features/order";
import { useMenuFilter } from "@/features/menu";
import { usePosTabs } from "./use-pos-tabs";
import { usePosModals } from "./use-pos-modals";
import { usePosOrder } from "./use-pos-order";

export function usePosPage() {
    // Store Global state & actions
    const cart = usePosStore((state) => state.cart);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const selectedTableId = usePosStore((state) => state.selectedTableId);
    const addToCart = usePosStore((state) => state.addToCart);
    const updateQuantity = usePosStore((state) => state.updateQuantity);

    // Sub-hooks
    const menuFilter = useMenuFilter();
    const posTabs = usePosTabs();
    const posModals = usePosModals();
    const { handleSendToKitchen, isSubmitting: isOrderSubmitting } = usePosOrder();

    // Fetch thông tin chi tiết đơn hàng hiện tại từ Server (lấy danh sách món đã gửi bếp)
    const { data: activeOrderDetail, isLoading: isOrderDetailLoading } = useOrderDetail(
        activeOrderId ?? undefined
    );

    // Danh sách món đã gửi chế biến từ Server
    const existingItems = activeOrderDetail?.items ?? [];

    /**
     * Xử lý khi nhấn nút "Gửi chế biến" trên Cart
     */
    const handleSendToKitchenClick = async () => {
        // Nếu chưa chọn Bàn và cũng chưa có Đơn hàng active -> Bật Modal yêu cầu chọn Bàn
        if (!activeOrderId && !selectedTableId) {
            posModals.setIsCreateModalOpen(true);
            return;
        }

        // Nếu đã chọn Bàn hoặc đã có đơn hàng -> Gửi thẳng xuống bếp
        await handleSendToKitchen();
    };

    /**
     * Xử lý khi người dùng ấn "Xác nhận" từ CreateOrderModal
     */
    const handleCreateOrderSubmit = async (formData: DraftFormData) => {
        const success = await handleSendToKitchen(formData);
        if (success) {
            posModals.setIsCreateModalOpen(false);
        }
    };

    const isSubmitting = isOrderSubmitting || posModals.isSubmitting;

    return {
        // Header Navigation Props
        headerNavProps: {
            openOrders: posTabs.openOrders,
            activeOrderId: posTabs.activeTabId,
            searchQuery: menuFilter.searchQuery,
            onSelectOrder: posTabs.handleSelectTab,
            onNewOrder: () => posModals.setIsCreateModalOpen(true),
            onCloseOrder: posTabs.handleCloseTab,
            onSearchChange: menuFilter.setSearchQuery,
        },

        // Category Bar Props
        categoryBarProps: {
            categories: menuFilter.categories,
            selectedCategoryId: menuFilter.selectedCategoryId,
            onSelectCategory: menuFilter.setSelectedCategoryId,
        },

        // Menu Grid Props
        menuGridProps: {
            dishes: menuFilter.filteredDishes,
            onAddToCart: addToCart,
            isLoading: menuFilter.isLoading,
        },

        // Cart Props
        cartProps: {
            cart,
            existingItems, // Món đã gửi bếp từ Server
            isSubmitting,
            onUpdateQuantity: updateQuantity,
            onSendToKitchen: handleSendToKitchenClick,
            onCheckout: () => posModals.setIsPaymentOpen(true),
        },

        // Create Order Modal Props (Dùng cho CreateOrderModal)
        createModalProps: {
            isOpen: posModals.isCreateModalOpen,
            tables: posModals.tables,
            isTablesLoading: posModals.isTablesLoading,
            isLoading: isSubmitting,
            onClose: () => posModals.setIsCreateModalOpen(false),
            onSubmit: handleCreateOrderSubmit,
        },

        // Payment Modal Props
        paymentModalProps: {
            isOpen: posModals.isPaymentOpen,
            orderDetail: activeOrderId
                ? {
                    id: activeOrderId,
                    items: existingItems,
                    tableId: activeOrderDetail?.tableId,
                    tableName: activeOrderDetail?.tableName,
                    totalAmount: activeOrderDetail?.totalAmount,
                }
                : null,
            cart,
            onClose: () => posModals.setIsPaymentOpen(false),
        },

        // State bổ sung nếu UI Container cần dùng
        isOrderDetailLoading,
        posModals,
    };
}