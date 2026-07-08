"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { DishStatus } from "../menu.types";

interface DishToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function DishToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: DishToolbarProps) {
  return (
    <div className="p-4 border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row gap-4 shrink-0 justify-between items-center">
      {/* Ô TÌM KIẾM NHANH */}
      <div className="relative w-full sm:max-w-sm">
        <Icon
          name="Search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
        />
        <input
          type="text"
          placeholder="Tìm tên món, mô tả..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
        />
      </div>

      {/* BỘ LỌC TRẠNG THÁI */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span className="text-[12px] font-bold text-on-surface-variant whitespace-nowrap">
          Trạng thái:
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-[13px] bg-surface border border-outline-variant rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer font-medium text-on-surface min-w-38.75"
        >
          <option value="All">Tất cả</option>
          <option value={DishStatus.ARCHIVED}>Lưu trữ</option>
          <option value={DishStatus.OUT_OF_STOCK}>Hết món</option>
          <option value={DishStatus.DISCONTINUED}>Ngừng kinh doanh</option>
        </select>
      </div>
    </div>
  );
}
