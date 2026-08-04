"use client";

import React from "react";
import { MenuCategoryResponse } from "@repo/shared-features/menu";
import { MenuCategoryTableRow } from "./menu-category-table-row";

interface CategoryTableProps {
  categories: MenuCategoryResponse[];
  isLoading: boolean;
  onEditClick?: (category: MenuCategoryResponse) => void;
  onDeleteClick?: (category: MenuCategoryResponse) => void;
  onRowClick?: (category: MenuCategoryResponse) => void;
  deletingCategoryId?: string | null;
}

export function MenuCategoryTable({
  categories,
  isLoading,
  onEditClick,
  onDeleteClick,
  onRowClick,
  deletingCategoryId,
}: CategoryTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-175">
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
            <th className="p-4 w-28 text-center">Trạng thái</th>
            <th className="p-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu danh mục...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Không tìm thấy danh mục nào phù hợp.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <MenuCategoryTableRow
                key={category.id}
                category={category}
                isDeleting={deletingCategoryId === category.id}
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
