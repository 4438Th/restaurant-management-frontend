"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useDishTrash } from "@/features/menu/hooks/dishes.hooks";
import { DishTrashTable } from "@/features/menu/components/dish-trash-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";

export default function DishTrashPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: pageData, isLoading: isFetchLoading } = useDishTrash(
    page,
    size,
    debouncedSearch || undefined,
  );

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
      {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI */}
      <PageHeader
        title="Thùng rác"
        description="Danh sách các món ăn, đồ uống đã xóa tạm thời khỏi thực đơn hệ
            thống."
        isTrash={true}
        backLink="/menu/dishes"
      />
      {/* CONTAINER CARD */}
      <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
        {/* Ô TÌM KIẾM NHANH */}
        <div className="p-4 border-b border-outline-variant bg-surface-bright flex gap-4 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Icon
              name="Search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn đã xóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* VÙNG CHỨA BẢNG */}
        <div className="flex-1 overflow-auto min-h-0">
          <DishTrashTable dishes={trashList} isLoading={isFetchLoading} />
        </div>

        {/* BỘ PHÂN TRANG GẮN CHẶT ĐÁY */}
        {pageData && (
          <div className="border-t border-outline-variant shrink-0">
            <TablePagination
              currentPage={pageData.currentPage}
              totalPages={totalPages}
              totalElements={pageData.totalElements}
              page={page}
              onPageChange={setPage}
              unitLabel="món ăn"
            />
          </div>
        )}
      </div>
    </main>
  );
}
