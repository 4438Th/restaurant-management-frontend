"use client";

import React from "react";
import { Icon } from "@repo/ui";
import {
  TableResponse,
  TableStatus,
  TableStatusLabel,
  TableAreaLabel,
  TableTypeLabel,
} from "@repo/shared-features/tables";

export interface TableTrashTableRowProps {
  table: TableResponse;
  onRestore: (id: string) => void;
  isRestoring?: boolean;
}

export function TableTrashTableRow({
  table,
  onRestore,
  isRestoring = false,
}: TableTrashTableRowProps) {
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

  return (
    <tr className="hover:bg-surface-container-low transition-colors group">
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
        <div
          className="flex items-center justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onRestore(table.id)}
            disabled={isRestoring}
            className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-600/10 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap shrink-0"
            title="Khôi phục bàn"
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
