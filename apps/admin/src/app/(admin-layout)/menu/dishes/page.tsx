"use client";

import React, { useState, useEffect } from "react";

import { DishToolbar } from "@/features/menu/components/dish-toolbar";
import { DishTable } from "@/features/menu/components/dish-table";
import { DishForm } from "@/features/menu/components/dish-form";
import { DishModal } from "@/features/menu/components/dish-modal";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";

import { useDish } from "@/features/menu/hooks/dishes.hooks";
import { useMenuCategory } from "@/features/menu/hooks/categories.hooks"; // IMPORT THÊM HOOK CATEGORY
import { DishResponse, DishStatus, DishType } from "@/features/menu/menu.types";

export default function DishesPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // STATE CÁC BỘ LỌC
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<DishResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // LẤY DANH SÁCH DANH MỤC ĐỂ ĐƯA VÀO SELECT BOX TRONG TOOLBAR
  const { data: categoryData } = useMenuCategory(1, 100, undefined, undefined);
  const categoriesList = categoryData?.data || [];
  const { data: pageData, isLoading: isFetchLoading } = useDish(
    page,
    size,
    debouncedSearch || undefined,
    selectedStatus === "All" ? undefined : (selectedStatus as DishStatus),
    selectedType === "All" ? undefined : (selectedType as DishType),
    selectedCategory === "All" ? undefined : selectedCategory,
  );

  const dishList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleCreateClick = (): void => {
    setSelectedDish(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (dish: DishResponse): void => {
    setSelectedDish(dish);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (dish: DishResponse) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        <PageHeader
          title="Danh sách món"
          description="Quản lý chi tiết các món trong thực đơn."
          buttonText="Thêm món mới"
          onButtonClick={handleCreateClick}
          trashLink="/menu/dishes/trash"
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <DishToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
            selectedType={selectedType}
            onTypeChange={(type: string) => {
              setSelectedType(type);
              setPage(1);
            }}
            selectedCategory={selectedCategory}
            onCategoryChange={(categoryId: string) => {
              setSelectedCategory(categoryId);
              setPage(1);
            }}
            categories={categoriesList}
          />

          <div className="flex-1 overflow-auto min-h-0">
            <DishTable
              dishes={dishList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onRowClick={handleRowClick}
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
                unitLabel="món"
              />
            </div>
          )}
        </div>
      </main>

      <DishForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dish={selectedDish}
      />
      <DishModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDish(null);
        }}
        dish={selectedDish}
      />
    </>
  );
}
