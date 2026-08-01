"use client";

import React from "react";
import { X, Users, MapPin, LayoutGrid, Clock, UserCheck } from "lucide-react";
import {
  TableResponse,
  TableStatus,
  TableStatusLabel,
  TableAreaLabel,
  TableTypeLabel,
} from "../tables.types";

interface TableDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableResponse | null;
}

export function TableDetailModal({
  isOpen,
  onClose,
  table,
}: TableDetailModalProps) {
  if (!isOpen || !table) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md overflow-hidden shadow-xl transition-all">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">
            Chi tiết bàn ăn
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-4 text-sm">
          {/* Tên Bàn + Trạng Thái */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">
                Tên bàn
              </span>
              <h3 className="text-xl font-bold text-on-surface">
                {table.tableName}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                table.status,
              )}`}
            >
              {TableStatusLabel[table.status] || table.status}
            </span>
          </div>

          {/* Sức chứa, Khu vực, Loại bàn */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Sức chứa</p>
                <p className="font-semibold text-on-surface">
                  {table.capacity} người
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Khu vực</p>
                <p className="font-semibold text-on-surface">
                  {TableAreaLabel[table.area] || table.area}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2">
              <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Loại bàn</p>
                <p className="font-semibold text-on-surface">
                  {TableTypeLabel[table.type] || table.type}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Audit */}
          <div className="pt-3 border-t border-outline-variant/50 space-y-2 text-xs text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tạo lúc:
              </span>
              <span className="font-medium text-on-surface">
                {formatDate(table.createdAt)}
              </span>
            </div>
            {table.createdBy && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Người tạo:
                </span>
                <span className="font-medium text-on-surface">
                  {table.createdBy}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
