"use client";

import React from "react";
import { Icon } from "@/components/ui";
import {
  DishStatusLabel,
  DishTypeLabel,
  MenuCategoryResponse,
} from "@repo/shared-features/menu";

interface DishToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: MenuCategoryResponse[];
}

export function DishToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: DishToolbarProps) {
  return (
    <div className="p-4 border-b border-outline-variant bg-surface-bright flex flex-col md:flex-row gap-4 shrink-0 justify-between md:items-center">
      {/* Ô TÌM KIẾM NHANH */}
      <div className="relative w-full md:max-w-xs">
        <Icon
          name="Search"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
        />
        <input
          type="text"
          placeholder="Tìm theo tên món,..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium"
        />
      </div>

      {/* NHÓM BỘ LỌC */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
        {/* LỌC DANH MỤC */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <span className="text-[12px] font-bold text-on-surface-variant hidden xl:inline-block">
            Danh mục:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-[13px] bg-surface border border-outline-variant rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer font-medium text-on-surface md:w-36"
          >
            <option value="All">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* LỌC LOẠI MÓN */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <span className="text-[12px] font-bold text-on-surface-variant hidden xl:inline-block">
            Loại:
          </span>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full text-[13px] bg-surface border border-outline-variant rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer font-medium text-on-surface md:w-32"
          >
            <option value="All">Tất cả loại</option>
            {Object.keys(DishTypeLabel).map((key) => (
              <option key={key} value={key}>
                {DishTypeLabel[key]}
              </option>
            ))}
          </select>
        </div>

        {/* LỌC TRẠNG THÁI */}
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <span className="text-[12px] font-bold text-on-surface-variant hidden xl:inline-block">
            Trạng thái:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full text-[13px] bg-surface border border-outline-variant rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer font-medium text-on-surface md:w-36"
          >
            <option value="All">Tất cả trạng thái</option>
            {Object.keys(DishStatusLabel)
              .filter((key) => key !== "DELETED")
              .map((key) => (
                <option key={key} value={key}>
                  {DishStatusLabel[key]}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
