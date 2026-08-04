"use client";

import React from "react";
import { DishResponse } from "@repo/shared-features/menu";
import { DishTableRow } from "./dish-table-row";

interface DishTableProps {
  dishes: DishResponse[];
  isLoading: boolean;
  deletingDishId?: string | null;
  onEditClick?: (dish: DishResponse) => void;
  onDeleteClick?: (dish: DishResponse) => void;
  onRowClick?: (dish: DishResponse) => void;
}

export function DishTable({
  dishes,
  isLoading,
  deletingDishId,
  onEditClick,
  onDeleteClick,
  onRowClick,
}: DishTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-200">
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
            <th className="p-4">Loại</th>
            <th className="p-4 text-right">Đơn giá</th>
            <th className="p-4 w-28 text-center">Trạng thái</th>
            <th className="p-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu món ăn...
              </td>
            </tr>
          ) : dishes.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Không tìm thấy món ăn nào phù hợp.
              </td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <DishTableRow
                key={dish.id}
                dish={dish}
                isDeleting={deletingDishId === dish.id}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onRowClick={onRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
