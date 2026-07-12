"use client";

import React, { useState, useEffect } from "react";

import { MenuCategoryToolbar } from "@/features/menu/components/menu-category-toolbar";
import { MenuCategoryTable } from "@/features/menu/components/menu-category-table";
import { MenuCategoryForm } from "@/features/menu/components/menu-category-form";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon"; // Import thêm icon để trang trí thẻ analytics nếu cần

import {
  useMenuCategory,
  useMenuCategoryAnalytics,
} from "@/features/menu/hooks/categories.hooks";
import {
  MenuCategoryResponse,
  MenuCategoryStatus,
} from "@/features/menu/menu.types";

export default function MenuCategoriesPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryResponse | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Hook lấy danh sách phân trang danh mục
  const { data: pageData, isLoading: isFetchLoading } = useMenuCategory(
    page,
    size,
    debouncedSearch || undefined,
    selectedStatus === "All"
      ? undefined
      : (selectedStatus as MenuCategoryStatus),
  );

  // Hook lấy dữ liệu thống kê món ăn theo danh mục mới bổ sung
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useMenuCategoryAnalytics();

  const categoriesList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleCreateClick = (): void => {
    setSelectedCategory(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (category: MenuCategoryResponse): void => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  return (
    <>
      {/* VÙNG CUỘN ĐỘC LẬP CHO NỘI DUNG MENU CATEGORY */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT CHUYỂN HƯỚNG TỚI THÙNG RÁC */}
        <PageHeader
          title="Danh mục thực đơn"
          description="Phân loại thực đơn giúp khách hàng và nhân viên dễ dàng tìm kiếm món."
          buttonText="Thêm danh mục"
          onButtonClick={handleCreateClick}
          trashLink="/menu/categories/trash"
        />

        {/* VÙNG THỐNG KÊ ANALYTICS CARDS */}
        {isAnalyticsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-21 bg-surface-container-low rounded-2xl border border-outline-variant"
              />
            ))}
          </div>
        ) : (
          analyticsData &&
          analyticsData.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {analyticsData.map((item) => (
                <div
                  key={item.categoryId}
                  className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-between shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-on-surface-variant truncate block uppercase tracking-wider">
                      {item.categoryName}
                    </span>
                    <span className="text-2xl font-black text-on-surface mt-1">
                      {item.totalDishes}
                      <span className="text-[12px] font-medium text-on-surface-variant ml-1 normal-case">
                        món
                      </span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 ml-2">
                    <Icon name="Utensils" className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* CONTAINER CARD BẢO VỆ BẢNG KHÔNG BỊ TRÀN VỠ */}
        <div
          className="flex-1 min-h-0 bg-surface-container-lowest
         border border-outline-variant rounded-2xl flex flex-col
          shadow-sm overflow-hidden"
        >
          {/* THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC */}
          <MenuCategoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
          />

          {/* VÙNG CHỨA TABLE: CHO PHÉP SCROLL NGANG NẾU DỮ LIỆU DÀI */}
          <div className="flex-1 overflow-auto min-h-0">
            <MenuCategoryTable
              categories={categoriesList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
            />
          </div>

          {/* THANH PHÂN TRANG GẮN ĐÁY BOX */}
          {pageData && (
            <div className="border-t border-outline-variant shrink-0">
              <TablePagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={page}
                onPageChange={setPage}
                unitLabel="danh mục"
              />
            </div>
          )}
        </div>
      </main>

      {/* THÀNH PHẦN FORM DRAWER NẰM CHỜ KÍCH HOẠT */}
      <MenuCategoryForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        category={selectedCategory}
      />
    </>
  );
}
