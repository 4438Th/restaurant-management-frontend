"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";

interface MenuCategoryHeaderProps {
  onAddClick: () => void;
  isTrashPage?: boolean;
  title?: string;
}

export function MenuCategoryHeader({
  onAddClick,
  isTrashPage = false,
  title,
}: MenuCategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-outline-variant bg-surface">
      <div>
        <h1 className="text-[22px] font-bold text-on-surface tracking-tight">
          {title || (isTrashPage ? "Thùng rác danh mục" : "Danh mục thực đơn")}
        </h1>
        <p className="text-[13px] text-on-surface-variant mt-0.5">
          {isTrashPage
            ? "Quản lý và khôi phục các danh mục món ăn đã tạm xóa"
            : "Phân loại thực đơn giúp khách hàng và nhân viên dễ dàng tìm kiếm món"}
        </p>
      </div>

      {!isTrashPage && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-primary text-on-primary font-bold text-[14px] rounded-xl hover:bg-primary/90 shadow-sm transition-all select-none"
        >
          <Icon name="Plus" className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      )}
    </div>
  );
}
