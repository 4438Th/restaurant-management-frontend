"use client";

import React from "react";
import { Icon } from "@repo/ui";
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
            className="h-35 rounded-xl bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between animate-pulse"
          >
            {/* Header Skeleton */}
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1 pr-4">
                <div className="h-4 bg-surface-container-high rounded w-2/3" />
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
              </div>
              <div className="h-6 w-16 bg-surface-container-high rounded-full" />
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-outline-variant/60 flex justify-between items-center">
              <div className="h-3 bg-surface-container-high rounded w-24" />
              <div className="flex gap-1">
                <div className="w-7 h-7 bg-surface-container-high rounded-lg" />
                <div className="w-7 h-7 bg-surface-container-high rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Màn hình trống khi không tìm thấy bàn
  if (tables.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
          <Icon name="UtensilsCrossed" className="w-6 h-6 text-outline" />
        </div>
        <p className="text-on-surface font-semibold text-[15px]">
          Không tìm thấy bàn ăn nào
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
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
