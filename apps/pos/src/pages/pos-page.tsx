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

import { AppLayout } from "@/components/layouts";
import { usePosStore } from "@/stores";
import { useMenu, MenuGrid, CategoryBar } from "@/features/menu";
import {
  OrderCart,
  PosHeaderNav,
  PaymentModal,
  type OpenOrder,
} from "@/features/pos";
import { usePosOrder } from "@/features/pos/hooks/use-pos-order";
import {
  CreateOrderModal,
  type CreateOrderFormData,
} from "@/features/pos/components/create-order-modal";

export function PosPage() {
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
  const setSelectedCategoryId = usePosStore(
    (state) => state.setSelectedCategoryId,
  );
  const setSearchQuery = usePosStore((state) => state.setSearchQuery);
  const createNewDraft = usePosStore((state) => state.createNewDraft);
  const selectDraft = usePosStore((state) => state.selectDraft);
  const closeDraft = usePosStore((state) => state.closeDraft);
  const setActiveOrder = usePosStore((state) => state.setActiveOrder);

  // HOOKS API
  const { categories, dishes, isLoading: isMenuLoading } = useMenu();

  // Lấy danh sách bàn cho Modal
  const { data: tableResponse, isLoading: isTablesLoading } = useTable();
  const tables = tableResponse?.data || [];

  const { data: ordersPage } = useOrders({
    status: OrderStatus.PROCESSING,
  });

  const { data: activeOrderDetail, isLoading: isDetailLoading } =
    useOrderDetail(activeOrderId || "", Boolean(activeOrderId));

  const { handleSendToKitchen, isSubmitting } = usePosOrder();

  // 1. KẾT HỢP CẢ ĐƠN NHÁP LOCAL VÀ ĐƠN TỪ SERVER LÊN NAV TABS
  const openOrders: OpenOrder[] = useMemo(() => {
    // a. Tab Đơn Nháp Local
    const draftTabs: OpenOrder[] = draftOrders.map((d) => ({
      id: d.id,
      orderCode: d.label,
      itemCount: d.cart.reduce((sum, i) => sum + i.quantity, 0),
    }));

    // b. Tab Đơn đã gửi bếp/đang phục vụ từ Server
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

  // ID Đơn đang active hiện tại
  const currentActiveTabId = activeOrderId || activeDraftId || undefined;

  // 2. HANDLERS
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

  // Click gửi bếp từ Sidebar OrderCart
  const onClickSendToKitchen = () => {
    if (!activeOrderId) {
      // Chưa có Order Server -> Bật modal chọn bàn & thông tin khách
      setIsCreateModalOpen(true);
    } else {
      // Đã có Order Server -> Gửi món bổ sung ngay
      handleSendToKitchen();
    }
  };

  // Callback submit form modal chọn bàn
  const handleConfirmCreateOrder = async (formData: CreateOrderFormData) => {
    const success = await handleSendToKitchen(formData);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  // Filter thực đơn
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

  return (
    <AppLayout title="Bán hàng - Máy POS">
      <div className="flex h-[calc(100vh-64px-2rem)] gap-4 -m-6 p-6">
        {/* KHU VỰC CHỌN MÓN CHÍNH */}
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <PosHeaderNav
            openOrders={openOrders}
            activeOrderId={currentActiveTabId}
            onSelectOrder={handleSelectTab}
            onNewOrder={handleCreateNewOrder}
            onCloseOrder={handleCloseTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          <div className="flex-1 overflow-y-auto pr-1">
            <MenuGrid
              dishes={filteredDishes}
              onAddToCart={addToCart}
              isLoading={isMenuLoading}
            />
          </div>
        </div>

        {/* SIDEBAR GIỎ HÀNG */}
        <OrderCart
          cart={cart}
          existingItems={activeOrderDetail?.items || []}
          isSubmitting={isSubmitting || isDetailLoading}
          onUpdateQuantity={updateQuantity}
          onSendToKitchen={onClickSendToKitchen}
          onCheckout={() => setIsPaymentOpen(true)}
        />
      </div>

      {/* MODAL CHỌN BÀN & TẠO ĐƠN */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        tables={tables}
        isTablesLoading={isTablesLoading}
        isLoading={isSubmitting}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleConfirmCreateOrder}
      />

      {/* MODAL THANH TOÁN */}
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          orderDetail={activeOrderDetail}
          cart={cart}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </AppLayout>
  );
}
