"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

import { DishToolbar } from "@/features/menu/components/dish-toolbar";
import { DishTable } from "@/features/menu/components/dish-table";
import { DishForm } from "@/features/menu/components/dish-form";
import { TablePagination } from "@/components/ui/table-pagination";
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

  return (
    <>
      {/* VÙNG CUỘN ĐỘC LẬP CHO NỘI DUNG MENU DISHES */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT HÀNH ĐỘNG */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-on-surface">
              Danh sách món ăn
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Quản lý chi tiết thực đơn, đơn giá, hình ảnh và tình trạng cung
              ứng món trên toàn hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* THÊM MÓN MỚI */}
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            >
              <Icon name="Plus" className="w-4 h-4" />
              <span>Thêm món mới</span>
            </button>

            {/* ĐƯỜNG DẪN TỚI THÙNG RÁC MÓN ĂN */}
            <Link
              href="/menu/dishes/trash"
              className="flex items-center gap-2 border border-outline-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            >
              <Icon name="Trash2" className="w-4 h-4 text-error" />
              <span>Thùng rác</span>
            </Link>
          </div>
        </div>

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
    </>
  );
}
