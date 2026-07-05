"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { MenuCategoryResponse } from "../menu.types";
import { useRestoreMenuCategory } from "../hooks/categories.hooks";

interface MenuCategoryTrashTableProps {
  categories: MenuCategoryResponse[];
  isLoading: boolean;
}

export function MenuCategoryTrashTable({
  categories,
  isLoading,
}: MenuCategoryTrashTableProps) {
  const restoreMutation = useRestoreMenuCategory();

  return (
    <div className="w-full overflow-x-auto border border-outline-variant rounded-2xl bg-surface">
      <table className="w-full text-left border-collapse table-auto min-w-125">
        <thead>
          <tr className="bg-surface-container-lowest text-[12px] font-bold text-on-surface-variant border-b border-outline-variant">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="rounded border-outline-variant text-primary cursor-pointer"
              />
            </th>
            <th className="p-4">Tên danh mục bị xóa</th>
            <th className="p-4">Mô tả trước đó</th>
            <th className="p-4 w-36 text-right">Thao tác</th>
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
                Thùng rác trống rỗng.
              </td>
            </tr>
          ) : (
            categories.map((category) => {
              const isRestoring =
                restoreMutation.isPending &&
                restoreMutation.variables === category.id;
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
                  <td className="p-4 text-on-surface-variant text-[13px] truncate max-w-xs">
                    {category.description}
                  </td>
                  <td className="p-4 text-right flex justify-end">
                    <button
                      onClick={() => restoreMutation.mutate(category.id)}
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
