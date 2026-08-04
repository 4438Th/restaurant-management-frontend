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

export interface TableCardProps {
  table: TableResponse;
  onEditClick: (table: TableResponse) => void;
  onDeleteClick: (table: TableResponse) => void;
  onCardClick: (table: TableResponse) => void;
}

export function TableCard({
  table,
  onEditClick,
  onDeleteClick,
  onCardClick,
}: TableCardProps) {
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
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div
      onClick={() => onCardClick(table)}
      className="group relative bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant hover:border-outline rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow cursor-pointer select-none"
    >
      {/* Header Card: Tên bàn + Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-on-surface text-base group-hover:text-primary transition-colors">
            {table.tableName}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {TableAreaLabel[table.area] || table.area} •{" "}
            {TableTypeLabel[table.type] || table.type}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(
            table.status,
          )}`}
        >
          {TableStatusLabel[table.status] || table.status}
        </span>
      </div>

      {/* Footer Card: Sức chứa + Nút thao tác */}
      <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Icon name="Users" className="w-4 h-4 text-outline" />
          <span>
            Sức chứa:{" "}
            <strong className="text-on-surface font-semibold">
              {table.capacity}
            </strong>{" "}
            người
          </span>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onEditClick(table)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
            title="Chỉnh sửa bàn"
          >
            <Icon name="Pencil" className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(table)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
            title="Xóa bàn"
          >
            <Icon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
