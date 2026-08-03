"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui";
import {
  DishResponse,
  DishStatusLabel,
  DishTypeLabel,
} from "@repo/shared-features/menu";
import { useDeleteDish } from "@repo/shared-features/menu";

interface DishTableProps {
  dishes: DishResponse[];
  isLoading: boolean;
  onEditClick?: (dish: DishResponse) => void;
  onRowClick?: (dish: DishResponse) => void;
}

export function DishTable({
  dishes,
  isLoading,
  onEditClick,
  onRowClick,
}: DishTableProps) {
  const deleteDishMutation = useDeleteDish();

  const handleDelete = (e: React.MouseEvent, dish: DishResponse) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa món ăn "${dish.dishName}" không?`)) {
      deleteDishMutation.mutate(dish.id);
    }
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

  // Nhận string thô từ API để map màu chính xác
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
            dishes.map((dish) => {
              const isDeleting =
                deleteDishMutation.isPending &&
                deleteDishMutation.variables === dish.id;
              return (
                <tr
                  key={dish.id}
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
                    {/* Dịch text từ key backend sang tiếng Việt bằng DishTypeLabel */}
                    <span
                      className={`px-2.5 py-0.5 font-bold text-[11px] rounded-lg shadow-sm whitespace-nowrap ${getTypeBadge(dish.type)}`}
                    >
                      {DishTypeLabel[dish.type] || dish.type}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-on-surface">
                    {dish.price
                      ? Number(dish.price).toLocaleString("vi-VN")
                      : "0"}
                    đ{" "}
                    <span className="text-[12px] font-normal text-on-surface-variant">
                      /{dish.unit}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {/* Dịch text từ key backend sang tiếng Việt bằng DishStatusLabel */}
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
                        onClick={() => onEditClick(dish)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        <Icon name="Pencil" className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, dish)}
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
