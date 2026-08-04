"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@repo/ui";
import {
  DishResponse,
  DishStatusLabel,
  DishTypeLabel,
} from "@repo/shared-features/menu";

interface DishTableRowProps {
  dish: DishResponse;
  isDeleting: boolean;
  onEditClick?: (dish: DishResponse) => void;
  onDeleteClick?: (dish: DishResponse) => void;
  onRowClick?: (dish: DishResponse) => void;
}

export function DishTableRow({
  dish,
  isDeleting,
  onEditClick,
  onDeleteClick,
  onRowClick,
}: DishTableRowProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick?.(dish);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-600 text-white dark:bg-emerald-700";
      case "ARCHIVED":
        return "bg-neutral-500 text-white dark:bg-neutral-600";
      case "OUT_OF_STOCK":
        return "bg-amber-500 text-white dark:bg-amber-600";
      case "DISCONTINUED":
        return "bg-error text-white";
      default:
        return "bg-zinc-500 text-white";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "FOOD":
        return "bg-amber-600 text-white dark:bg-amber-700";
      case "BEVERAGE":
        return "bg-sky-600 text-white dark:bg-sky-700";
      default:
        return "bg-zinc-500 text-white dark:bg-zinc-600";
    }
  };

  return (
    <tr
      onClick={() => onRowClick?.(dish)}
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
          {dish.imageUrl ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-outline-variant shrink-0">
              <Image
                src={dish.imageUrl}
                alt={dish.dishName || "Hình ảnh món ăn"}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name="Utensils" className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-primary truncate max-w-50">
              {dish.dishName}
            </div>
            <div className="text-[12px] text-on-surface-variant truncate max-w-50">
              {dish.description || "Không có mô tả"}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-on-surface-variant font-medium">
        {dish.category?.categoryName || "Chưa phân loại"}
      </td>
      <td className="p-4">
        <span
          className={`px-2.5 py-0.5 font-bold text-[11px] rounded-lg shadow-sm whitespace-nowrap ${getTypeBadge(dish.type)}`}
        >
          {DishTypeLabel[dish.type] || dish.type}
        </span>
      </td>
      <td className="p-4 text-right font-mono font-bold text-on-surface">
        {dish.price ? Number(dish.price).toLocaleString("vi-VN") : "0"}đ{" "}
        <span className="text-[12px] font-normal text-on-surface-variant">
          /{dish.unit}
        </span>
      </td>
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold shadow-sm whitespace-nowrap ${getStatusStyle(dish.status)}`}
        >
          {DishStatusLabel[dish.status] || dish.status}
        </span>
      </td>
      <td
        className="p-4 text-right flex justify-end gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {onEditClick && (
          <button
            type="button"
            onClick={() => onEditClick(dish)}
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
