import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { DishResponse } from "@repo/shared-features/menu";
import {
    useOrders,
    useOrderDetail,
    OrderStatus,
    type OrderResponse,
} from "@repo/shared-features/order";
import { useTable } from "@repo/shared-features/tables";

import { usePosStore } from "@/stores";
import { useMenu, type CategoryBarProps, type MenuGridProps } from "@/features/menu";
import {
    usePosOrder,
    type OpenOrder,
    type PosHeaderNavProps,
    type OrderCartProps,
    type PaymentModalProps,
} from "@/features/pos";
import type {
    CreateOrderModalProps,
    CreateOrderFormData,
} from "@/features/pos";

export function usePosPage() {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // ZUSTAND STORE
    const cart = usePosStore((state) => state.cart);
    const draftOrders = usePosStore((state) => state.draftOrders);
    const activeDraftId = usePosStore((state) => state.activeDraftId);
    const activeOrderId = usePosStore((state) => state.activeOrderId);
    const selectedCategoryId = usePosStore((state) => state.selectedCategoryId);
    const searchQuery = usePosStore((state) => state.searchQuery);

    const addToCart = usePosStore((state) => state.addToCart);
    const updateQuantity = usePosStore((state) => state.updateQuantity);
    const setSelectedCategoryId = usePosStore((state) => state.setSelectedCategoryId);
    const setSearchQuery = usePosStore((state) => state.setSearchQuery);
    const createNewDraft = usePosStore((state) => state.createNewDraft);
    const selectDraft = usePosStore((state) => state.selectDraft);
    const closeDraft = usePosStore((state) => state.closeDraft);
    const setActiveOrder = usePosStore((state) => state.setActiveOrder);

    // API HOOKS
    const { categories, dishes, isLoading: isMenuLoading } = useMenu();

    const { data: tableResponse, isLoading: isTablesLoading } = useTable();
    const tables = tableResponse?.data || [];

    const { data: ordersPage } = useOrders({
        status: OrderStatus.PROCESSING,
    });

    const { data: activeOrderDetail, isLoading: isDetailLoading } =
        useOrderDetail(activeOrderId || "", Boolean(activeOrderId));

    const { handleSendToKitchen, isSubmitting } = usePosOrder();

    // DERIVED DATA
    const openOrders: OpenOrder[] = useMemo(() => {
        const draftTabs: OpenOrder[] = draftOrders.map((d) => ({
            id: d.id,
            orderCode: d.label,
            itemCount: d.cart.reduce((sum, i) => sum + i.quantity, 0),
        }));

        const serverList = ordersPage?.data || [];
        const serverTabs: OpenOrder[] = serverList.map((ord: OrderResponse) => ({
            id: ord.id,
            tableName:
                ord.tableName || (ord.tableId ? `Bàn ${ord.tableId}` : undefined),
            orderCode: `#${ord.id.slice(-4).toUpperCase()}`,
            itemCount: ord.items?.length || 0,
        }));

        return [...draftTabs, ...serverTabs];
    }, [draftOrders, ordersPage]);

    const currentActiveTabId = activeOrderId || activeDraftId || undefined;

    // HANDLERS
    const handleSelectTab = (orderId: string) => {
        if (orderId.startsWith("draft-")) {
            selectDraft(orderId);
        } else {
            setActiveOrder(orderId);
        }
    };

    const handleCreateNewOrder = () => {
        createNewDraft();
        setIsCreateModalOpen(true);
    };

    const handleCloseTab = (orderId: string) => {
        if (orderId.startsWith("draft-")) {
            closeDraft(orderId);
        } else {
            toast.warning("Đơn hàng đang phục vụ không thể đóng trực tiếp.");
        }
    };

    const onClickSendToKitchen = () => {
        if (!activeOrderId) {
            setIsCreateModalOpen(true);
        } else {
            handleSendToKitchen();
        }
    };

    const handleConfirmCreateOrder = async (formData: CreateOrderFormData) => {
        const success = await handleSendToKitchen(formData);
        if (success) {
            setIsCreateModalOpen(false);
        }
    };

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish: DishResponse) => {
            const matchCategory =
                selectedCategoryId === "ALL" ||
                dish.category?.id === selectedCategoryId;
            const matchSearch =
                !searchQuery ||
                dish.dishName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [dishes, selectedCategoryId, searchQuery]);

    // PACKAGED PROPS
    const headerNavProps: PosHeaderNavProps = {
        openOrders,
        activeOrderId: currentActiveTabId,
        searchQuery,
        onSelectOrder: handleSelectTab,
        onNewOrder: handleCreateNewOrder,
        onCloseOrder: handleCloseTab,
        onSearchChange: setSearchQuery,
    };

    const categoryBarProps: CategoryBarProps = {
        categories,
        selectedCategoryId,
        onSelectCategory: setSelectedCategoryId,
    };

    const menuGridProps: MenuGridProps = {
        dishes: filteredDishes,
        onAddToCart: addToCart,
        isLoading: isMenuLoading,
    };

    const cartProps: OrderCartProps = {
        cart,
        existingItems: activeOrderDetail?.items || [],
        isSubmitting: isSubmitting || isDetailLoading,
        onUpdateQuantity: updateQuantity,
        onSendToKitchen: onClickSendToKitchen,
        onCheckout: () => setIsPaymentOpen(true),
    };

    const createModalProps: CreateOrderModalProps = {
        isOpen: isCreateModalOpen,
        tables,
        isTablesLoading,
        isLoading: isSubmitting,
        onClose: () => setIsCreateModalOpen(false),
        onSubmit: handleConfirmCreateOrder,
    };

    const paymentModalProps: PaymentModalProps = {
        isOpen: isPaymentOpen,
        orderDetail: activeOrderDetail
            ? {
                id: activeOrderDetail.id,
                orderDetails: activeOrderDetail.items || [],
            }
            : null,
        cart,
        onClose: () => setIsPaymentOpen(false),
    };

    return {
        headerNavProps,
        categoryBarProps,
        menuGridProps,
        cartProps,
        createModalProps,
        paymentModalProps,
    };
}