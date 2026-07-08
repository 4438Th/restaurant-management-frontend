"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { DishResponse } from "../menu.types";
import { useRestoreDish } from "../hooks/dishes.hooks";

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
            <th className="p-4 w-32 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu thùng rác...
              </td>
            </tr>
          ) : dishes.length === 0 ? (
            <tr>
              <td
                colSpan={5}
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
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-outline-variant">
                          <Image
                            src={dish.imageUrl}
                            alt={dish.itemName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Icon name="Utensils" className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-primary">
                          {dish.itemName}
                        </div>
                        <span className="text-[11px] bg-error/10 text-error px-1.5 py-0.2 rounded font-bold uppercase">
                          {dish.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {dish.category?.categoryName || "---"}
                  </td>
                  <td className="p-4 text-right font-mono text-on-surface-variant">
                    {Number(dish.price).toLocaleString("vi-VN")}đ
                  </td>
                  <td
                    className="p-4 text-right flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => restoreMutation.mutate(dish.id)}
                      disabled={isRestoring}
                      className="px-3 py-1.5 text-success hover:bg-success/10 rounded-xl transition-colors flex items-center gap-1.5 text-[12px] font-bold disabled:opacity-40"
                    >
                      {isRestoring ? (
                        <div className="w-4 h-4 border-2 border-success border-t-transparent rounded-full animate-spin" />
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
