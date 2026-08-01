"use client";

import React, { useState, useEffect } from "react";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableGrid } from "@/features/tables/components/table-grid";
import { TableToolbar } from "@/features/tables/components/table-toolbar";
import { TableForm } from "@/features/tables/components/table-form";
import { TableDetailModal } from "@/features/tables/components/table-detail-modal";
import { PageHeader } from "@/components/layout/page-header";

import { useTable, useDeleteTable } from "@/features/tables/tables.hooks";
import {
  TableResponse,
  TableFilterParams,
} from "@/features/tables/tables.types";

export default function TableManagementPage() {
  // Trạng thái nhập liệu tìm kiếm tức thời trên UI (Tên bàn/Số bàn)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedArea, setSelectedArea] = useState<string>("All");

  // Tập trung toàn bộ trạng thái phân trang & bộ lọc vào một Object Type-safe duy nhất
  const [filters, setFilters] = useState<TableFilterParams>({
    page: 1,
    size: 12, // Bội số 12 phù hợp cho dạng Grid/Card
    search: undefined,
    status: undefined,
    area: undefined,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<TableResponse | null>(
    null,
  );

  // Hook xóa bàn ăn
  const deleteTableMutation = useDeleteTable();

  // Đồng bộ hóa cơ chế Debounce Search và tích hợp các bộ lọc cứng vào State filters
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        page: 1, // Reset về trang đầu tiên khi thay đổi tiêu chí tìm kiếm/bộ lọc
        size: 12,
        search: searchQuery.trim() || undefined,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        area: selectedArea === "All" ? undefined : selectedArea,
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedStatus, selectedArea]);

  // Gọi hook React Query lấy danh sách bàn ăn
  const { data: pageData, isLoading: isFetchLoading } = useTable(filters);

  const tablesList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleCreateClick = (): void => {
    setSelectedTable(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (table: TableResponse): void => {
    setSelectedTable(table);
    setIsDrawerOpen(true);
  };

  const handleCardClick = (table: TableResponse): void => {
    setSelectedTable(table);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (table: TableResponse): void => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${table.tableName}" không?`)) {
      deleteTableMutation.mutate(table.id);
    }
  };

  return (
    <>
      {/* VÙNG CUỘN ĐỘC LẬP CHO NỘI DUNG QUẢN LÝ BÀN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT CHUYỂN HƯỚNG TỚI THÙNG RÁC */}
        <PageHeader
          title="Danh sách bàn ăn"
          description="Quản lý thông tin bàn, khu vực và trạng thái phục vụ tại nhà hàng."
          buttonText="Thêm bàn mới"
          onButtonClick={handleCreateClick}
          trashLink="/tables/trash"
        />

        {/* CONTAINER CARD BẢO VỆ BẢNG / GRID KHÔNG BỊ TRÀN VỠ */}
        <div
          className="flex-1 min-h-0 bg-surface-container-lowest
          border border-outline-variant rounded-2xl flex flex-col
          shadow-sm overflow-hidden"
        >
          {/* Thanh Toolbar lọc theo từ khóa, Trạng thái và Khu vực */}
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => setSelectedStatus(status)}
            selectedArea={selectedArea}
            onAreaChange={(area: string) => setSelectedArea(area)}
          />

          {/* Vùng hiển thị danh sách bàn dạng Grid */}
          <div className="flex-1 overflow-auto min-h-0 p-4">
            <TableGrid
              tables={tablesList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onCardClick={handleCardClick}
            />
          </div>

          {/* THANH PHÂN TRANG GẮN ĐÁY BOX */}
          {pageData && (
            <div className="border-t border-outline-variant shrink-0">
              <TablePagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={filters.page || 1}
                onPageChange={(pageOrFn) => {
                  setFilters((prev) => {
                    const nextPage =
                      typeof pageOrFn === "function"
                        ? pageOrFn(prev.page || 1)
                        : pageOrFn;

                    return { ...prev, page: nextPage };
                  });
                }}
                unitLabel="bàn ăn"
              />
            </div>
          )}
        </div>
      </main>

      {/* CÁC THÀNH PHẦN FORM MODAL & DRAWERS NẰM NGOÀI ĐỢI KÍCH HOẠT */}
      <TableForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        table={selectedTable}
      />

      <TableDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        table={selectedTable}
      />
    </>
  );
}
