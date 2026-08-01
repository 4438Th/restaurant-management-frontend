"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import {
  TableResponse,
  TableStatus,
  TableStatusLabel,
  TableAreaLabel,
  TableTypeLabel,
} from "../tables.types";
import { useRestoreTable } from "../tables.hooks";

interface TableTrashTableProps {
  tables: TableResponse[];
  isLoading: boolean;
}

export function TableTrashTable({ tables, isLoading }: TableTrashTableProps) {
  const restoreMutation = useRestoreTable();

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const getStatusBadgeClass = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case TableStatus.OCCUPIED:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case TableStatus.RESERVED:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case TableStatus.MAINTENANCE:
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      case TableStatus.DELETED:
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

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
            <tr
              key={table.id}
              className="hover:bg-surface-container-low transition-colors group"
            >
              {/* Tên bàn */}
              <td className="py-3.5 px-4 font-semibold text-on-surface">
                {table.tableName}
              </td>

              {/* Khu vực */}
              <td className="py-3.5 px-4 text-on-surface-variant text-xs">
                {TableAreaLabel[table.area] || table.area}
              </td>

              {/* Loại bàn */}
              <td className="py-3.5 px-4 text-on-surface-variant text-xs">
                {TableTypeLabel[table.type] || table.type}
              </td>

              {/* Sức chứa */}
              <td className="py-3.5 px-4 text-on-surface-variant text-xs">
                {table.capacity} người
              </td>

              {/* Trạng thái */}
              <td className="py-3.5 px-4 text-xs">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                    table.status,
                  )}`}
                >
                  {TableStatusLabel[table.status] || table.status}
                </span>
              </td>

              {/* Thao tác Restore */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => handleRestore(table.id)}
                    disabled={restoreMutation.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                    title="Khôi phục bàn"
                  >
                    <Icon name="RotateCcw" className="w-3.5 h-3.5" />
                    <span>Khôi phục</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
