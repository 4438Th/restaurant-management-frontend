"use client";

import React from "react";
import { Icon } from "@repo/ui";
import {
  useDishAnalytics,
  DishStatus,
  DishStatusLabel,
  DishType,
  DishTypeLabel,
} from "@repo/shared-features/menu";

export function DishAnalytics() {
  const { data: rawData, isLoading } = useDishAnalytics();

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* KHU VỰC THỐNG KÊ THEO LOẠI MÓN */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col gap-3">
          <h4 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 border-b border-outline-variant pb-2">
            <Icon name="Layers" className="w-4 h-4 text-primary" /> PHÂN LOẠI
            THỰC ĐƠN
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(DishTypeLabel) as [DishType, string][]).map(
              ([typeKey, label]) => {
                const count = analyticsData.totalByType?.[typeKey] || 0;
                return (
                  <div
                    key={typeKey}
                    className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50"
                  >
                    <span className="text-[11px] font-bold text-on-surface-variant block truncate">
                      {label}
                    </span>
                    <span className="text-xl font-extrabold text-on-surface mt-1 block">
                      {count}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* KHU VỰC THỐNG KÊ THEO TRẠNG THÁI */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col gap-3">
          <h4 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 border-b border-outline-variant pb-2">
            <Icon name="Activity" className="w-4 h-4 text-primary" /> TRẠNG THÁI
            KINH DOANH
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(DishStatusLabel) as [DishStatus, string][])
              .filter(([statusKey]) => statusKey !== DishStatus.DELETED)
              .map(([statusKey, label]) => {
                const count = analyticsData.totalByStatus?.[statusKey] || 0;
                return (
                  <div
                    key={statusKey}
                    className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50"
                  >
                    <span className="text-[11px] font-bold text-on-surface-variant block truncate">
                      {label}
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
