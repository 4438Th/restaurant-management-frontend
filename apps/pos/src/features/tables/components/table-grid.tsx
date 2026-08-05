import React from "react";
import { TableCard, type TableStatusUI } from "@repo/ui";
import type { TableResponse } from "@repo/shared-features/tables";

export interface StatusOption {
  label: string;
  value: string;
}

const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Bàn trống", value: "AVAILABLE" },
  { label: "Đang có khách", value: "OCCUPIED" },
  { label: "Đã đặt trước", value: "RESERVED" },
  { label: "Bảo trì", value: "MAINTENANCE" },
];

export interface TableGridProps {
  /** Danh sách bàn ăn đã lọc/hoặc danh sách gốc */
  tables: TableResponse[];
  /** Bàn đang được chọn */
  selectedTableId?: string | null;
  /** Trạng thái lọc hiện tại */
  selectedStatus?: string;
  /** Danh sách bộ lọc trạng thái (mặc định sẵn 5 trạng thái chuẩn) */
  statusOptions?: StatusOption[];
  /** Trạng thái loading */
  isLoading?: boolean;
  /** Trạng thái lỗi */
  isError?: boolean;
  /** Callback chọn bàn */
  onSelectTable?: (tableId: string) => void;
  /** Callback đổi tab lọc trạng thái */
  onStatusChange?: (status: string) => void;
  /** Callback bấm nút thử lại khi lỗi */
  onRetry?: () => void;
  /** ClassName tùy biến */
  className?: string;
}

export const TableGrid: React.FC<TableGridProps> = ({
  tables,
  selectedTableId,
  selectedStatus = "ALL",
  statusOptions = DEFAULT_STATUS_OPTIONS,
  isLoading = false,
  isError = false,
  onSelectTable,
  onStatusChange,
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
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full hover:opacity-90"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Status Filter Tabs */}
      {onStatusChange && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusOptions.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedStatus === tab.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-on-surface-variant text-sm">
          Không tìm thấy bàn nào phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      )}
    </div>
  );
};
