"use client";

import React, { useState, useEffect } from "react";

import { MenuCategoryToolbar } from "@/features/menu/components/menu-category-toolbar";
import { MenuCategoryTable } from "@/features/menu/components/menu-category-table";
import { MenuCategoryForm } from "@/features/menu/components/menu-category-form";
import { MenuCategoryAnalytics } from "@/features/menu/components/menu-category-analytics"; // Component mới tách
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";

import { useMenuCategory } from "@/features/menu/hooks/categories.hooks";
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
        {/* VÙNG THỐNG KÊ ANALYTICS CARDS (Đã bọc lại thành 1 component sạch sẽ) */}
        <MenuCategoryAnalytics />
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
