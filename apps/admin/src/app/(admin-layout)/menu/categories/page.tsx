"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

// Import đúng bộ components theo mô hình trang users
import { MenuCategoryToolbar } from "@/features/menu/components/menu-category-toolbar";
import { MenuCategoryTable } from "@/features/menu/components/menu-category-table";
import { MenuCategoryForm } from "@/features/menu/components/menu-category-form";
import { TablePagination } from "@/components/ui/table-pagination";
// Import Hooks/Hooks custom phục vụ phân trang giống trang users
import { useMenuCategory } from "@/features/menu/hooks/categories.hooks";
import {
  MenuCategoryResponse,
  MenuCategoryStatus,
} from "@/features/menu/menu.types";

export default function MenuCategoriesPage() {
  // --- 1. QUẢN LÝ TRẠNG THÁI PHÂN TRANG VÀ BỘ LỌC ---
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // --- 2. QUẢN LÝ TRẠNG THÁI ĐÓNG MỞ FORM/DRAWER ---
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryResponse | null>(null);

  // --- 3. ĐỒNG BỘ CƠ CHẾ DEBOUNCE SEARCH NÂNG CAO ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset về trang 1 khi gõ tìm kiếm
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- 4. GỌI API PHÂN TRANG QUA CUSTOM HOOK (GIỐNG USEUSERS) ---
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

  // --- 5. HÀM ĐIỀU HƯỚNG TƯƠNG TÁC GIAO DIỆN ---
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
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-on-surface">
              Danh mục thực đơn
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Phân loại thực đơn giúp khách hàng và nhân viên dễ dàng tìm kiếm
              món.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* THÊM DANH MỤC MỚI */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            >
              <Icon name="Plus" className="w-4 h-4" />
              <span>Thêm danh mục</span>
            </button>

            {/* ĐƯỜNG DẪN TỚI THÙNG RÁC DANH MỤC */}
            <Link
              href="/admin/menu/categories/trash"
              className="flex items-center gap-2 border border-outline-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            >
              <Icon name="Trash2" className="w-4 h-4 text-error" />
              <span>Thùng rác</span>
            </Link>
          </div>
        </div>

        {/* CONTAINER CARD BẢO VỆ BẢNG KHÔNG BỊ TRÀN VỠ */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
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
