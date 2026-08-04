"use client";

import React from "react";
import { MenuCategoryResponse } from "@repo/shared-features/menu";
import { CategoryTrashTableRow } from "./menu-category-trash-table-row";

interface CategoryTrashTableProps {
  categories: MenuCategoryResponse[];
  isLoading: boolean;
  onRestoreClick?: (category: MenuCategoryResponse) => void;
  onRowClick?: (category: MenuCategoryResponse) => void;
  restoringCategoryId?: string | null;
}

export function CategoryTrashTable({
  categories,
  isLoading,
  onRestoreClick,
  onRowClick,
  restoringCategoryId,
}: CategoryTrashTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-125">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="rounded border-outline-variant text-primary cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </th>
            <th className="p-4">Tên danh mục</th>
            <th className="p-4">Mô tả</th>
            <th className="p-4 w-32 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu thùng rác...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Thùng rác trống.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <CategoryTrashTableRow
                key={category.id}
                category={category}
                isRestoring={restoringCategoryId === category.id}
                onRestoreClick={onRestoreClick}
                onRowClick={onRowClick}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
