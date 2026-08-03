"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui";
import {
  DishResponse,
  DishStatus,
  DishTypeLabel,
} from "@repo/shared-features/menu";
import { useRestoreDish } from "@repo/shared-features/menu";

interface DishTrashTableProps {
  dishes: DishResponse[];
  isLoading: boolean;
  onRowClick?: (dish: DishResponse) => void;
}

export function DishTrashTable({
  dishes,
  isLoading,
  onRowClick,
}: DishTrashTableProps) {
  const restoreMutation = useRestoreDish();

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="text-[11px] bg-emerald-600/10 text-emerald-600 dark:text-emerald-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            {DishStatus.AVAILABLE}
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            Tạm hết món
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="text-[11px] bg-neutral-500/10 text-neutral-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            {DishStatus.ARCHIVED}
          </span>
        );
      case "DISCONTINUED":
        return (
          <span className="text-[11px] bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            Ngừng bán
          </span>
        );
      case "DELETED":
        return (
          <span className="text-[11px] bg-red-500/10 text-red-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            {DishStatus.DELETED}
          </span>
        );
      default:
        return (
          <span className="text-[11px] bg-zinc-500/10 text-zinc-500 px-2.5 py-0.5 rounded-lg font-bold shadow-sm whitespace-nowrap">
            Không rõ
          </span>
        );
    }
  };

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
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu thùng rác...
              </td>
            </tr>
          ) : dishes.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Thùng rác trống.
              </td>
            </tr>
          ) : (
            dishes.map((dish) => {
              const isRestoring =
                restoreMutation.isPending &&
                restoreMutation.variables === dish.id;
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
                        <span className="inline-block mt-0.5 text-[11px] bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded font-bold uppercase">
                          {DishTypeLabel[dish.type] || dish.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant font-medium">
                    {dish.category?.categoryName || "---"}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-on-surface">
                    {dish.price
                      ? Number(dish.price).toLocaleString("vi-VN")
                      : "0"}
                    đ
                  </td>
                  <td className="p-4 text-center">
                    {renderStatusBadge(dish.status)}
                  </td>
                  <td
                    className="p-4 text-right flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => restoreMutation.mutate(dish.id)}
                      disabled={isRestoring}
                      className="px-3 py-1.5 text-emerald-600 hover:bg-emerald-600/10 dark:text-emerald-500 rounded-xl transition-colors flex items-center gap-1.5 text-[12px] font-bold disabled:opacity-40"
                    >
                      {isRestoring ? (
                        <div className="w-4 h-4 border-2 border-emerald-600 dark:border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon name="RotateCcw" className="w-4 h-4" />
                      )}
                      <span>Khôi phục</span>
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
