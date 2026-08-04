"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { TableResponse } from "@repo/shared-features/tables";
import { TableTrashTableRow } from "./table-trash-table-row";

export interface TableTrashTableProps {
  tables: TableResponse[];
  isLoading: boolean;
  onRestore: (id: string) => void;
  restoringTableId?: string | null;
}

export function TableTrashTable({
  tables,
  isLoading,
  onRestore,
  restoringTableId = null,
}: TableTrashTableProps) {
  // 1. Trạng thái Loading (Skeleton Rows)
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-on-surface">
          <thead className="bg-surface-bright border-b border-outline-variant text-xs text-on-surface-variant font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Tên bàn</th>
              <th className="py-3 px-4">Khu vực</th>
              <th className="py-3 px-4">Loại bàn</th>
              <th className="py-3 px-4">Sức chứa</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-3.5 px-4">
                  <div className="h-4 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-24 bg-surface-container-high rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-20 bg-surface-container-high rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-12 bg-surface-container-high rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-5 w-20 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="h-8 w-20 bg-surface-container-high rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 2. Trạng thái Thùng rác rỗng
  if (tables.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
          <Icon name="Trash2" className="w-6 h-6" />
        </div>
        <p className="text-on-surface font-medium text-sm">
          Thùng rác bàn ăn trống
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Không có bàn ăn nào trong danh mục đã xóa.
        </p>
      </div>
    );
  }

  // 3. Render Danh sách Bàn ăn đã bị xóa
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm text-on-surface">
        <thead className="bg-surface-bright border-b border-outline-variant text-xs text-on-surface-variant font-semibold uppercase sticky top-0 z-10">
          <tr>
            <th className="py-3 px-4">Tên bàn</th>
            <th className="py-3 px-4">Khu vực</th>
            <th className="py-3 px-4">Loại bàn</th>
            <th className="py-3 px-4">Sức chứa</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60 bg-surface-container-lowest">
          {tables.map((table) => (
            <TableTrashTableRow
              key={table.id}
              table={table}
              onRestore={onRestore}
              isRestoring={restoringTableId === table.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
