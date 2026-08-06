"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@repo/core";
import { Icon, TablePagination } from "@repo/ui";

import { CategoryTrashTable } from "@/features/menu/components";
import { PageHeader } from "@/components/layout";

import {
  useMenuCategoryTrash,
  useRestoreMenuCategory,
  MenuCategoryResponse,
  MenuCategoryFilterParams,
} from "@repo/shared-features/menu";

export default function MenuCategoryTrashPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const restoreMutation = useRestoreMenuCategory();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Object filter params đồng nhất cấu trúc
  const filterParams: MenuCategoryFilterParams = {
    page,
    size,
    search: debouncedSearch.trim() || undefined,
  };

  // Hook lấy danh sách thùng rác
  const { data: pageData, isLoading: isFetchLoading } =
    useMenuCategoryTrash(filterParams);

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  // Xử lý khôi phục danh mục & thông báo Toast
  const handleRestoreClick = (category: MenuCategoryResponse) => {
    restoreMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success(
          `Khôi phục danh mục "${category.categoryName}" thành công!`,
        );
      },
      onError: (error: ApiError) => {
        toast.error(error?.message || "Có lỗi xảy ra khi khôi phục danh mục!");
      },
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
      <PageHeader
        title="Thùng rác"
        description="Danh sách danh mục thực đơn đã xóa. Bạn có thể khôi phục lại hoạt động của chúng."
        isTrash={true}
        backLink="/menu/categories"
      />

      <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
        {/* Thanh tìm kiếm */}
        <div className="p-4 border-b border-outline-variant bg-surface-bright flex gap-4 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Icon
              name="Search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục đã xóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="flex-1 overflow-auto min-h-0">
          <CategoryTrashTable
            categories={trashList}
            isLoading={isFetchLoading}
            onRestoreClick={handleRestoreClick}
            restoringCategoryId={
              restoreMutation.isPending
                ? (restoreMutation.variables as string)
                : null
            }
          />
        </div>

        {/* Phân trang */}
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
  );
}
