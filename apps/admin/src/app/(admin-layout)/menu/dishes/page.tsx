"use client";

import React, { useState, useEffect } from "react";

import { DishToolbar } from "@/features/menu/components/dish-toolbar";
import { DishTable } from "@/features/menu/components/dish-table";
import { DishForm } from "@/features/menu/components/dish-form";
import { DishModal } from "@/features/menu/components/dish-modal";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";

import { useDish } from "@/features/menu/hooks/dishes.hooks";
import { DishResponse, DishStatus } from "@/features/menu/menu.types";

export default function DishesPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

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

  const { data: pageData, isLoading: isFetchLoading } = useDish(
    page,
    size,
    debouncedSearch || undefined,
    selectedStatus === "All" ? undefined : (selectedStatus as DishStatus),
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
      {/* VÙNG CUỘN ĐỘC LẬP CHO NỘI DUNG MENU DISHES */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT HÀNH ĐỘNG */}
        <PageHeader
          title="Danh sách món"
          description="Quản lý chi tiết các món trong thực đơn."
          buttonText="Thêm món mới"
          onButtonClick={handleCreateClick}
          trashLink="/menu/dishes/trash"
        />

        {/* CONTAINER CARD BẢO VỆ BẢNG */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          {/* THANH CÔNG CỤ TÌM KIẾM & BỘ LỌC */}
          <DishToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
          />

          {/* VÙNG CHỨA TABLE */}
          <div className="flex-1 overflow-auto min-h-0">
            <DishTable
              dishes={dishList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onRowClick={handleRowClick}
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
                unitLabel="món"
              />
            </div>
          )}
        </div>
      </main>

      {/* DRAWER FORM NẰM CHỜ KÍCH HOẠT */}
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
