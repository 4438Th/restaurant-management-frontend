"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { MenuCategoryResponse, MenuCategoryStatus } from "../menu.types";
import { useDeleteMenuCategory } from "../hooks/categories.hooks";

interface CategoryTableProps {
  categories: MenuCategoryResponse[];
  isLoading: boolean;
  onEditClick?: (category: MenuCategoryResponse) => void;
  onRowClick?: (category: MenuCategoryResponse) => void;
}

export function MenuCategoryTable({
  categories,
  isLoading,
  onEditClick,
  onRowClick,
}: CategoryTableProps) {
  const deleteCategoryMutation = useDeleteMenuCategory();

  const handleDelete = (
    e: React.MouseEvent,
    category: MenuCategoryResponse,
  ) => {
    e.stopPropagation();
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${category.categoryName}" không?`,
      )
    ) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  // Hàm mapping màu sắc chuẩn dựa trên MenuCategoryStatus Enum
  const getStatusStyle = (status: MenuCategoryStatus) => {
    switch (status) {
      case MenuCategoryStatus.ACTIVE:
        return "bg-green-600/10 text-green-600";
      case MenuCategoryStatus.DRAFT:
        return "bg-blue-500/10 text-blue-500";
      case MenuCategoryStatus.INACTIVE:
        return "bg-amber-500/10 text-amber-500";
      case MenuCategoryStatus.DELETED:
        return "bg-error/10 text-error";
      default:
        return "bg-on-surface/10 text-on-surface-variant";
    }
  };

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
            categories.map((category) => {
              const isDeleting =
                deleteCategoryMutation.isPending &&
                deleteCategoryMutation.variables === category.id;
              return (
                <tr
                  key={category.id}
                  onClick={() => onRowClick?.(category)}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer select-none"
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon name="Folder" className="w-4 h-4" />
                      </div>
                      <div className="font-semibold text-primary">
                        {category.categoryName}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant max-w-xs truncate">
                    {category.description || (
                      <span className="italic text-[13px]">Không có mô tả</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(category.status)}`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td
                    className="p-4 text-right flex justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEditClick && (
                      <button
                        onClick={() => onEditClick(category)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        <Icon name="Pencil" className="w-4 h-4" />
                      </button>
                    )}
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
