"use client";

import React from "react";
import { TableResponse } from "@repo/shared-features/tables";
import { TableCard } from "./table-card";

interface TableGridProps {
  tables: TableResponse[];
  isLoading: boolean;
  onEditClick: (table: TableResponse) => void;
  onDeleteClick: (table: TableResponse) => void;
  onCardClick: (table: TableResponse) => void;
}

export function TableGrid({
  tables,
  isLoading,
  onEditClick,
  onDeleteClick,
  onCardClick,
}: TableGridProps) {
  // Skeleton Loading khi đang fetch API
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-xl bg-surface-container-high/50 animate-pulse border border-outline-variant/50 p-4 flex flex-col justify-between"
          />
        ))}
      </div>
    );
  }

  // Màn hình trống khi không tìm thấy bàn
  if (tables.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
        <p className="text-on-surface-variant font-medium">
          Không tìm thấy bàn ăn nào
        </p>
        <p className="text-sm text-outline mt-1">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}
