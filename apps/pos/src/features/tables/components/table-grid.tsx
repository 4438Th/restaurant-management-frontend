import React from "react";
import { TableCard, type TableStatusUI } from "@repo/ui";
import type { TableResponse } from "@repo/shared-features/tables";

export interface TableGridProps {
  /** Danh sách bàn ăn đã lọc/hoặc danh sách gốc */
  tables: TableResponse[];
  /** Bàn đang được chọn */
  selectedTableId?: string | null;
  /** Trạng thái loading */
  isLoading?: boolean;
  /** Trạng thái lỗi */
  isError?: boolean;
  /** Callback chọn bàn */
  onSelectTable?: (tableId: string) => void;
  /** Callback bấm nút thử lại khi lỗi */
  onRetry?: () => void;
  /** ClassName tùy biến */
  className?: string;
}

export const TableGrid: React.FC<TableGridProps> = ({
  tables,
  selectedTableId,
  isLoading = false,
  isError = false,
  onSelectTable,
  onRetry,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-1 ${className}`}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-surface-container-high animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 text-center text-error ${className}`}
      >
        <p className="font-semibold mb-2">Không thể tải danh sách bàn ăn!</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full hover:opacity-90 transition"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div
        className={`flex justify-center items-center h-48 text-on-surface-variant text-sm ${className}`}
      >
        Không tìm thấy bàn nào phù hợp
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}
    >
      {tables.map((table: TableResponse) => {
        const isCurrentSelected = selectedTableId === table.id;

        return (
          <TableCard
            key={table.id}
            id={table.id}
            tableName={table.tableName}
            capacity={table.capacity}
            status={table.status as TableStatusUI}
            onClick={onSelectTable}
            className={
              isCurrentSelected
                ? "border-primary! ring-2! ring-primary/40! shadow-lg scale-[1.02]"
                : ""
            }
          />
        );
      })}
    </div>
  );
};
