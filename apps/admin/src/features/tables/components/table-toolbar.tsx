"use client";

import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import {
  TableStatus,
  TableStatusLabel,
  TableArea,
  TableAreaLabel,
} from "../tables.types";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  onResetFilters?: () => void;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedArea,
  onAreaChange,
  onResetFilters,
}: TableToolbarProps) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedStatus !== "All" ||
    selectedArea !== "All";

  return (
    <div className="p-4 border-b border-outline-variant/60 bg-surface-container-lowest flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Ô Nhập từ khóa tìm kiếm */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên bàn hoặc số bàn..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
        />
      </div>

      {/* Vùng Dropdown bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Lọc theo Khu vực */}
        <div className="flex items-center gap-1.5 bg-surface border border-outline-variant rounded-xl px-3 py-1.5 text-xs text-on-surface-variant">
          <Filter className="w-3.5 h-3.5 text-outline" />
          <span className="font-medium">Khu vực:</span>
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="bg-transparent outline-none font-semibold text-on-surface cursor-pointer pr-1"
          >
            <option value="All">Tất cả khu vực</option>
            {Object.values(TableArea).map((area) => (
              <option key={area} value={area}>
                {TableAreaLabel[area]}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Trạng thái */}
        <div className="flex items-center gap-1.5 bg-surface border border-outline-variant rounded-xl px-3 py-1.5 text-xs text-on-surface-variant">
          <span className="font-medium">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent outline-none font-semibold text-on-surface cursor-pointer pr-1"
          >
            <option value="All">Tất cả trạng thái</option>
            {Object.values(TableStatus)
              .filter((status) => status !== TableStatus.DELETED)
              .map((status) => (
                <option key={status} value={status}>
                  {TableStatusLabel[status]}
                </option>
              ))}
          </select>
        </div>

        {/* Nút Đặt lại Bộ lọc */}
        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="p-2 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl border border-outline-variant transition-colors flex items-center gap-1"
            title="Đặt lại bộ lọc"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  );
}
