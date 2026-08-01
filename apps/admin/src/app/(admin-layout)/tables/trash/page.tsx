"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { useTableTrash } from "@/features/tables/tables.hooks";
import { TableTrashTable } from "@/features/tables/components/table-trash-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { PageHeader } from "@/components/layout/page-header";
import { TableFilterParams } from "@/features/tables/tables.types";

export default function TableTrashPage() {
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

  // ĐỒNG BỘ: Gộp cấu trúc filter params cho thùng rác bàn ăn
  const trashParams: TableFilterParams = {
    page,
    size,
    search: debouncedSearch.trim() || undefined,
  };

  // ĐỒNG BỘ: Gọi hook lấy danh sách bàn ăn đã bị xóa tạm thời
  const { data: pageData, isLoading: isFetchLoading } =
    useTableTrash(trashParams);

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
      <PageHeader
        title="Thùng rác"
        description="Danh sách các bàn ăn đã xóa tạm thời khỏi sơ đồ nhà hàng."
        isTrash={true}
        backLink="/tables"
      />

      <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-outline-variant bg-surface-bright flex gap-4 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Icon
              name="Search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bàn ăn đã xóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Bảng dữ liệu thùng rác */}
        <div className="flex-1 overflow-auto min-h-0">
          <TableTrashTable tables={trashList} isLoading={isFetchLoading} />
        </div>

        {/* Thanh phân trang */}
        {pageData && (
          <div className="border-t border-outline-variant shrink-0">
            <TablePagination
              currentPage={pageData.currentPage}
              totalPages={totalPages}
              totalElements={pageData.totalElements}
              page={page}
              onPageChange={setPage}
              unitLabel="bàn ăn"
            />
          </div>
        )}
      </div>
    </main>
  );
}
