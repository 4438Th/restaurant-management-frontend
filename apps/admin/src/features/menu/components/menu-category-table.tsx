// apps/admin/src/features/menu/components/menu-category-table.tsx
"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { MenuCategoryResponse, MenuCategoryStatus } from "../menu.types";
import { useDeleteMenuCategory } from "../hooks/categories.hooks";

interface MenuCategoryTableProps {
  categories: MenuCategoryResponse[];
  isLoading: boolean;
  onEditClick: (category: MenuCategoryResponse) => void;
}

export function MenuCategoryTable({
  categories,
  isLoading,
  onEditClick,
}: MenuCategoryTableProps) {
  const deleteMutation = useDeleteMenuCategory();

  const handleDelete = (
    e: React.MouseEvent,
    category: MenuCategoryResponse,
  ) => {
    e.stopPropagation();
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${category.categoryName}" vào thùng rác?`,
      )
    ) {
      deleteMutation.mutate(category.id);
    }
  };

  const getStatusBadgeClass = (status: MenuCategoryStatus) => {
    switch (status) {
      case MenuCategoryStatus.ACTIVE:
        return "bg-green-600/10 text-green-600";
      case MenuCategoryStatus.INACTIVE:
        return "bg-amber-500/10 text-amber-500";
      case MenuCategoryStatus.DRAFT:
        return "bg-slate-500/10 text-slate-500";
      default:
        return "bg-error/10 text-error";
    }
  };

  const getStatusLabel = (status: MenuCategoryStatus) => {
    switch (status) {
      case MenuCategoryStatus.ACTIVE:
        return "Đang chạy";
      case MenuCategoryStatus.INACTIVE:
        return "Đang ẩn";
      case MenuCategoryStatus.DRAFT:
        return "Bản nháp";
      default:
        return "Đã xóa";
    }
  };

  return (
    /* 
      THAY ĐỔI TẠI ĐÂY:
      - Xóa 'rounded-2xl' để table vuông vức không bo góc.
      - Thêm 'h-full flex-1' để bảng chiếm trọn vẹn không gian chiều cao của container.
    */
    <div className="w-full h-full flex-1 overflow-x-auto border border-outline-variant rounded-none bg-surface">
      <table className="w-full text-left border-collapse table-auto min-w-150">
        <thead>
          <tr className="bg-surface-container-lowest text-[12px] font-bold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="border-outline-variant text-primary cursor-pointer"
              />
            </th>
            <th className="p-4">Tên danh mục</th>
            <th className="p-4">Mô tả chi tiết</th>
            <th className="p-4 w-32 text-center">Trạng thái</th>
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
                Đang tải danh mục...
              </td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Không tìm thấy danh mục thực đơn nào.
              </td>
            </tr>
          ) : (
            categories.map((category) => {
              const isDeleting =
                deleteMutation.isPending &&
                deleteMutation.variables === category.id;
              return (
                <tr
                  key={category.id}
                  className="hover:bg-surface-container-low/50 transition-colors select-none"
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-4 font-semibold text-on-surface">
                    {category.categoryName}
                  </td>
                  <td className="p-4 text-on-surface-variant max-w-sm truncate">
                    {category.description || (
                      <span className="italic text-[12px] opacity-50">
                        Không có mô tả
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadgeClass(category.status)}`}
                    >
                      {getStatusLabel(category.status)}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1">
                    <button
                      onClick={() => onEditClick(category)}
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <Icon name="Pencil" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, category)}
                      disabled={isDeleting}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon name="Trash2" className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
