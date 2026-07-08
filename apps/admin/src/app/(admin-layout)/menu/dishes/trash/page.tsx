"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useDish } from "@/features/menu/hooks/dishes.hooks";
import { DishTrashTable } from "@/features/menu/components/dish-trash-table";
import { TablePagination } from "@/components/ui/table-pagination";

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

  const { data: pageData, isLoading: isFetchLoading } = useDish(
    page,
    size,
    debouncedSearch || undefined,
  );

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
      {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-[28px] font-black tracking-tight text-error flex items-center gap-3">
            <Icon name="Trash2" className="w-7 h-7" />
            Thùng rác món ăn
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Danh sách các món ăn, đồ uống đã xóa tạm thời khỏi thực đơn hệ
            thống.
          </p>
        </div>

        <Link
          href="/menu/dishes"
          className="flex items-center gap-2 bg-surface-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          <span>Quay lại</span>
        </Link>
      </div>

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
