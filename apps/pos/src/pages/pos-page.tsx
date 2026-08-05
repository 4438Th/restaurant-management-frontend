import { useState, useMemo } from "react";
import { useTable, type TableResponse } from "@repo/shared-features/tables";
import type { DishResponse } from "@repo/shared-features/menu";

import { AppLayout } from "@/components/layouts";
import { usePosStore } from "@/stores";
import { useMenu, MenuGrid, CategoryBar } from "@/features/menu";
import { OrderCart } from "@/features/pos";
import { TableGrid } from "@/features/tables";

export function PosPage() {
  // 1. Quản lý tab hiển thị giữa Menu và Sơ đồ bàn
  const [activeTab, setActiveTab] = useState<"MENU" | "TABLES">("MENU");
  const [selectedTableStatus, setSelectedTableStatus] = useState<string>("ALL");

  // 2. Zustand Store (POS & Cart State)
  const cart = usePosStore((state) => state.cart);
  const selectedCategoryId = usePosStore((state) => state.selectedCategoryId);
  const searchQuery = usePosStore((state) => state.searchQuery);
  const selectedTableId = usePosStore((state) => state.selectedTableId);

  const addToCart = usePosStore((state) => state.addToCart);
  const updateQuantity = usePosStore((state) => state.updateQuantity);
  const setSelectedCategoryId = usePosStore(
    (state) => state.setSelectedCategoryId,
  );
  const setSearchQuery = usePosStore((state) => state.setSearchQuery);
  const setSelectedTableId = usePosStore((state) => state.setSelectedTableId);

  // 3. Hooks lấy dữ liệu Thực đơn & Bàn ăn từ API
  const { categories, dishes, isLoading: isMenuLoading } = useMenu();
  const {
    data: tablesData,
    isLoading: isTablesLoading,
    isError: isTablesError,
    refetch: refetchTables,
  } = useTable();

  // 4. Bóc tách dữ liệu danh sách Bàn ăn
  const tables: TableResponse[] = useMemo(() => {
    if (Array.isArray(tablesData)) return tablesData;
    return tablesData?.data ?? [];
  }, [tablesData]);

  // 5. Filter danh sách Món ăn
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

  // 6. Filter danh sách Bàn ăn
  const filteredTables = useMemo(() => {
    return tables.filter((table: TableResponse) => {
      if (selectedTableStatus === "ALL") return true;
      return table.status === selectedTableStatus;
    });
  }, [tables, selectedTableStatus]);

  // Bàn đang chọn hiện tại
  const currentSelectedTable = useMemo(() => {
    return tables.find((t) => t.id === selectedTableId);
  }, [tables, selectedTableId]);

  return (
    <AppLayout title="Bán hàng - Máy POS">
      <div className="flex h-[calc(100vh-64px-2rem)] gap-4 -m-6 p-6">
        {/* Khu vực chính: Menu hoặc Sơ đồ Bàn */}
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          {/* Main Navigation Tabs & Search */}
          <div className="flex items-center justify-between gap-4 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/50 shrink-0">
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("MENU")}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
                  activeTab === "MENU"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Thực đơn
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("TABLES")}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                  activeTab === "TABLES"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>Sơ đồ bàn</span>
                {currentSelectedTable && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md">
                    {currentSelectedTable.tableName}
                  </span>
                )}
              </button>
            </div>

            {/* Thanh tìm kiếm món */}
            {activeTab === "MENU" && (
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-1.5 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* TAB 1: THỰC ĐƠN */}
          {activeTab === "MENU" && (
            <>
              {/* Category Bar tái sử dụng từ features/menu */}
              <CategoryBar
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              {/* Grid hiển thị món ăn */}
              <div className="flex-1 overflow-y-auto pr-1">
                <MenuGrid
                  dishes={filteredDishes}
                  onAddToCart={addToCart}
                  isLoading={isMenuLoading}
                />
              </div>
            </>
          )}

          {/* TAB 2: SƠ ĐỒ BÀN */}
          {activeTab === "TABLES" && (
            <div className="flex-1 overflow-y-auto pr-1">
              <TableGrid
                tables={filteredTables}
                selectedTableId={selectedTableId}
                selectedStatus={selectedTableStatus}
                isLoading={isTablesLoading}
                isError={isTablesError}
                onSelectTable={(tableId) => {
                  setSelectedTableId(tableId);
                  setActiveTab("MENU"); // Tự động quay về tab menu khi đã chọn bàn
                }}
                onStatusChange={(status) => setSelectedTableStatus(status)}
                onRetry={refetchTables}
              />
            </div>
          )}
        </div>

        {/* Sidebar Giỏ hàng bên phải */}
        <OrderCart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => alert("Chuyển sang màn hình xác nhận đơn")}
        />
      </div>
    </AppLayout>
  );
}
