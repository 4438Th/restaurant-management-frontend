"use client";

import React, { useState, useEffect } from "react";

import { MenuCategoryToolbar } from "@/features/menu/components/menu-category-toolbar";
import { MenuCategoryTable } from "@/features/menu/components/menu-category-table";
import { MenuCategoryForm } from "@/features/menu/components/menu-category-form";
import { MenuCategoryAnalytics } from "@/features/menu/components/menu-category-analytics";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";

import { useMenuCategory } from "@/features/menu/hooks/categories.hooks";
import {
  MenuCategoryResponse,
  MenuCategoryStatus,
  MenuCategoryFilterParams,
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

  // ĐỒNG BỘ: Tạo object filter params theo đúng định nghĩa MenuCategoryFilterParams
  const filterParams: MenuCategoryFilterParams = {
    page,
    size,
    search: debouncedSearch.trim() || undefined,
    status:
      selectedStatus === "All"
        ? undefined
        : (selectedStatus as MenuCategoryStatus),
  };

  // ĐỒNG BỘ: Truyền duy nhất một object params vào Hook
  const { data: pageData, isLoading: isFetchLoading } =
    useMenuCategory(filterParams);

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
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        <PageHeader
          title="Danh mục thực đơn"
          description="Phân loại thực đơn giúp khách hàng và nhân viên dễ dàng tìm kiếm món."
          buttonText="Thêm danh mục"
          onButtonClick={handleCreateClick}
          trashLink="/menu/categories/trash"
        />

        <div
          className="flex-1 min-h-0 bg-surface-container-lowest
         border border-outline-variant rounded-2xl flex flex-col
          shadow-sm overflow-hidden"
        >
          <MenuCategoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
          />

          <div className="flex-1 overflow-auto min-h-0">
            <MenuCategoryTable
              categories={categoriesList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
            />
          </div>

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
        <MenuCategoryAnalytics />
      </main>

      <MenuCategoryForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        category={selectedCategory}
      />
    </>
  );
}
