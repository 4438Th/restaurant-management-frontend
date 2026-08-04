"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { DishResponse } from "@repo/shared-features/menu";
import { DishTrashTableRow } from "./dish-trash-table-row";

interface DishTrashTableProps {
  dishes: DishResponse[];
  isLoading: boolean;
  restoringDishId?: string | null;
  onRestoreClick?: (dish: DishResponse) => void;
  onRowClick?: (dish: DishResponse) => void;
}

export function DishTrashTable({
  dishes,
  isLoading,
  restoringDishId,
  onRestoreClick,
  onRowClick,
}: DishTrashTableProps) {
  // 1. Loading State (Skeleton Rows)
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-150">
          <thead>
            <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-outline-variant text-primary"
                />
              </th>
              <th className="p-4">Món ăn</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4 text-right">Đơn giá</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 w-32 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-4 text-center">
                  <div className="h-4 w-4 bg-surface-container-high rounded mx-auto" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container-high rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-32 bg-surface-container-high rounded" />
                      <div className="h-3 w-20 bg-surface-container-high rounded" />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-surface-container-high rounded" />
                </td>
                <td className="p-4 text-right">
                  <div className="h-4 w-16 bg-surface-container-high rounded ml-auto" />
                </td>
                <td className="p-4 text-center">
                  <div className="h-5 w-20 bg-surface-container-high rounded-full mx-auto" />
                </td>
                <td className="p-4 text-right">
                  <div className="h-8 w-20 bg-surface-container-high rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 2. Empty State
  if (dishes.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
          <Icon name="Trash2" className="w-6 h-6" />
        </div>
        <p className="text-on-surface font-medium text-sm">Thùng rác trống</p>
        <p className="text-xs text-on-surface-variant mt-1">
          Không có món ăn nào trong thùng rác thực đơn.
        </p>
      </div>
    );
  }

  // 3. Render Table
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-150">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="rounded border-outline-variant text-primary cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </th>
            <th className="p-4">Món ăn</th>
            <th className="p-4">Danh mục</th>
            <th className="p-4 text-right">Đơn giá</th>
            <th className="p-4 text-center">Trạng thái</th>
            <th className="p-4 w-32 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant bg-surface-container-lowest">
          {dishes.map((dish) => (
            <DishTrashTableRow
              key={dish.id}
              dish={dish}
              isRestoring={restoringDishId === dish.id}
              onRestoreClick={onRestoreClick}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
