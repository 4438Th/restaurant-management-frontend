"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { MenuCategoryResponse } from "@repo/shared-features/menu";

interface CategoryTrashTableRowProps {
  category: MenuCategoryResponse;
  isRestoring: boolean;
  onRestoreClick?: (category: MenuCategoryResponse) => void;
  onRowClick?: (category: MenuCategoryResponse) => void;
}

export function CategoryTrashTableRow({
  category,
  isRestoring,
  onRestoreClick,
  onRowClick,
}: CategoryTrashTableRowProps) {
  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestoreClick?.(category);
  };

  return (
    <tr
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
      <td className="p-4 text-right">
        <div
          className="flex justify-end items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleRestore}
            disabled={isRestoring}
            className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-600/10 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap shrink-0"
          >
            {isRestoring ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Icon name="RotateCcw" className="w-4 h-4 shrink-0" />
                <span>Khôi phục</span>
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
