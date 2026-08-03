"use client";

import React from "react";
import { Icon } from "@/components/ui";
import { useDishAnalytics } from "@repo/shared-features/menu";
import {
  DishStatus,
  DishStatusLabel,
  DishType,
  DishTypeLabel,
} from "@repo/shared-features/menu";

export function DishAnalytics() {
  const { data: rawData, isLoading } = useDishAnalytics();

  // Trích xuất cục data thực tế
  const analyticsData = rawData;

  // 1. Trạng thái Skeleton Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-surface-container-low rounded-2xl border border-outline-variant"
          />
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* CARD TỔNG QUAN CHÍNH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider block opacity-80">
              Tổng số món
            </span>
            <span className="text-3xl font-black mt-1 block">
              {analyticsData.totalDishes}
            </span>
          </div>
          <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0">
            <Icon name="UtensilsCrossed" className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KHU VỰC THỐNG KÊ THEO LOẠI MÓN (FOOD, BEVERAGE...) */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col gap-3">
          <h4 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 border-b border-outline-variant pb-2">
            <Icon name="Layers" className="w-4 h-4 text-primary" /> PHÂN LOẠI
            THỰC ĐƠN
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(DishTypeLabel).map((typeKey) => {
              const count =
                analyticsData.totalByType?.[typeKey as DishType] || 0;
              return (
                <div
                  key={typeKey}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50"
                >
                  <span className="text-[11px] font-bold text-on-surface-variant block truncate">
                    {DishTypeLabel[typeKey]}
                  </span>
                  <span className="text-xl font-extrabold text-on-surface mt-1 block">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC THỐNG KÊ THEO TRẠNG THÁI (AVAILABLE, OUT_OF_STOCK...) */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col gap-3">
          <h4 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 border-b border-outline-variant pb-2">
            <Icon name="Activity" className="w-4 h-4 text-primary" /> TRẠNG THÁI
            KINH DOANH
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(DishStatusLabel)
              .filter((key) => key !== "DELETED") // Ẩn trạng thái đã xóa ra khỏi dashboard chính
              .map((statusKey) => {
                const count =
                  analyticsData.totalByStatus?.[statusKey as DishStatus] || 0;
                return (
                  <div
                    key={statusKey}
                    className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50"
                  >
                    <span className="text-[11px] font-bold text-on-surface-variant block truncate">
                      {DishStatusLabel[statusKey]}
                    </span>
                    <span className="text-xl font-extrabold text-on-surface mt-1 block">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
