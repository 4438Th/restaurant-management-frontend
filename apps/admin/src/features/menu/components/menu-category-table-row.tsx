"use client";

import React from "react";
import { Icon } from "@repo/ui";
import {
  MenuCategoryResponse,
  MenuCategoryStatus,
} from "@repo/shared-features/menu";

interface MenuCategoryTableRowProps {
  category: MenuCategoryResponse;
  isDeleting: boolean;
  onEditClick?: (category: MenuCategoryResponse) => void;
  onDeleteClick?: (category: MenuCategoryResponse) => void;
  onRowClick?: (category: MenuCategoryResponse) => void;
}

export function MenuCategoryTableRow({
  category,
  isDeleting,
  onEditClick,
  onDeleteClick,
  onRowClick,
}: MenuCategoryTableRowProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick?.(category);
  };

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
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(
            category.status,
          )}`}
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
            type="button"
            onClick={() => onEditClick(category)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          >
            <Icon name="Pencil" className="w-4 h-4" />
          </button>
        )}
        {onDeleteClick && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="Trash2" className="w-4 h-4" />
            )}
          </button>
        )}
      </td>
    </tr>
  );
}
