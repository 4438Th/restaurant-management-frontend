import { useMemo } from "react";
import type { DishResponse } from "@repo/shared-features/menu";

import { AppLayout } from "@/components/layouts";
import { usePosStore } from "@/stores";
import { useMenu, MenuGrid, CategoryBar } from "@/features/menu";
import { OrderCart, PosHeaderNav } from "@/features/pos";

export function PosPage() {
  // 1. Zustand Store (POS & Cart State)
  const cart = usePosStore((state) => state.cart);
  const selectedCategoryId = usePosStore((state) => state.selectedCategoryId);
  const searchQuery = usePosStore((state) => state.searchQuery);

  const addToCart = usePosStore((state) => state.addToCart);
  const updateQuantity = usePosStore((state) => state.updateQuantity);
  const setSelectedCategoryId = usePosStore(
    (state) => state.setSelectedCategoryId,
  );
  const setSearchQuery = usePosStore((state) => state.setSearchQuery);

  // 2. Hook lấy dữ liệu Thực đơn từ API
  const { categories, dishes, isLoading: isMenuLoading } = useMenu();

  // 3. Filter danh sách Món ăn theo Danh mục & Từ khóa tìm kiếm
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
        {/* Khu vực chọn món chính */}
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          {/* Header Navigation cho Màn hình bán hàng */}
          <PosHeaderNav
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Thanh chọn Danh mục */}
          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Lưới danh sách Món ăn */}
          <div className="flex-1 overflow-y-auto pr-1">
            <MenuGrid
              dishes={filteredDishes}
              onAddToCart={addToCart}
              isLoading={isMenuLoading}
            />
          </div>
        </div>

        {/* Sidebar Giỏ hàng & Thanh toán */}
        <OrderCart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => alert("Chuyển sang màn hình xác nhận đơn")}
        />
      </div>
    </AppLayout>
  );
}
