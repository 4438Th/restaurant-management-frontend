"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { useMenuCategoryAnalytics } from "@repo/shared-features/menu";

export function MenuCategoryAnalytics() {
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useMenuCategoryAnalytics();

  // 1. Trạng thái đang tải dữ liệu (Skeleton Loading)
  if (isAnalyticsLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-21 bg-surface-container-low rounded-2xl border border-outline-variant"
          />
        ))}
      </div>
    );
  }

  // 2. Nếu không có dữ liệu hoặc mảng rỗng thì ẩn hoàn toàn component
  if (!analyticsData || analyticsData.length === 0) {
    return null;
  }

  // 3. Giao diện danh sách thẻ thống kê hoàn chỉnh
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {analyticsData.map((item) => (
        <div
          key={item.categoryId}
          className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-between shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-on-surface-variant truncate block uppercase tracking-wider">
              {item.categoryName}
            </span>
            <span className="text-2xl font-black text-on-surface mt-1">
              {item.totalDishes}
              <span className="text-[12px] font-medium text-on-surface-variant ml-1 normal-case">
                món
              </span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 ml-2">
            <Icon name="Utensils" className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
