"use client";

import React from "react";
import { Icon } from "@repo/ui";
import {
  DishResponse,
  DishStatus,
  DishStatusLabel,
  DishTypeLabel,
} from "@repo/shared-features/menu";

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishResponse | null;
}

export function DishModal({ isOpen, onClose, dish }: DishModalProps) {
  if (!isOpen || !dish) return null;

  // Hàm helper render badge phân loại chuẩn theo Key từ backend
  const renderTypeBadge = (type: string) => {
    const label = DishTypeLabel[type] || "Khác";

    switch (type) {
      case "FOOD":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-amber-600 text-white dark:bg-amber-700 flex items-center gap-1.5 w-fit shadow-sm">
            <Icon name="Utensils" className="w-3.5 h-3.5 text-white" />
            <span>{label}</span>
          </span>
        );
      case "BEVERAGE":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-sky-600 text-white dark:bg-sky-700 flex items-center gap-1.5 w-fit shadow-sm">
            <Icon name="CupSoda" className="w-3.5 h-3.5 text-white" />
            <span>{label}</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-zinc-500 text-white dark:bg-zinc-600 flex items-center gap-1.5 w-fit shadow-sm">
            <Icon name="Layers" className="w-3.5 h-3.5 text-white" />
            <span>{label}</span>
          </span>
        );
    }
  };

  // Hàm helper render badge trạng thái ĐỒNG BỘ 100% màu sắc đậm rõ nét với Table
  const renderStatusBadge = (status: DishStatus) => {
    const label = DishStatusLabel[status] || status;

    switch (status) {
      case "OUT_OF_STOCK":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-amber-500 text-white dark:bg-amber-600 shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{label}</span>
          </span>
        );
      case "DISCONTINUED":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-error text-white shadow-sm flex items-center gap-1 w-fit">
            <span>{label}</span>
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-neutral-500 text-white dark:bg-neutral-600 shadow-sm flex items-center gap-1 w-fit">
            <span>{label}</span>
          </span>
        );
      case "DELETED":
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-black bg-red-700 text-white shadow-sm flex items-center gap-1 w-fit">
            <span>{label}</span>
          </span>
        );
      case "AVAILABLE":
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-emerald-600 text-white dark:bg-emerald-700 shadow-sm flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{label}</span>
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* KHU VỰC HÌNH ẢNH MÓN ĂN (BANNER) */}
        <div className="relative w-full h-56 bg-surface-container-low border-b border-outline-variant">
          {dish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dish.imageUrl}
              alt={dish.dishName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant bg-surface-bright">
              <Icon
                name="UtensilsCrossed"
                className="w-12 h-12 text-neutral-300"
              />
              <span className="text-[12px] italic text-neutral-400">
                Chưa cập nhật hình ảnh
              </span>
            </div>
          )}

          {/* NÚT TẮT MODAL ĐÈ TRÊN ẢNH */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* NỘI DUNG THÔNG TIN CHI TIẾT */}
        <div className="p-5 flex flex-col gap-4 text-[14px]">
          {/* TÊN MÓN VÀ GIÁ */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-on-surface leading-snug">
                {dish.dishName}
              </h3>
              <div className="shrink-0 font-mono text-lg font-black text-primary">
                {Number(dish.price).toLocaleString("vi-VN")}đ
              </div>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {renderTypeBadge(dish.type)}
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-on-surface-variant font-medium">
                Đơn vị: <b className="text-on-surface">{dish.unit || "Đĩa"}</b>
              </span>
            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* CHI TIẾT DANH MỤC & TRẠNG THÁI */}
          <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-3 rounded-xl border border-outline-variant">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-on-surface-variant font-medium">
                Danh mục thực đơn
              </span>
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="Folder" className="w-4 h-4 text-primary" />
                {dish.category?.categoryName || "Chưa phân loại"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-on-surface-variant font-medium">
                Trạng thái
              </span>
              <div className="mt-0.5">{renderStatusBadge(dish.status)}</div>
            </div>
          </div>

          {/* MÔ TẢ CHI TIẾT */}
          <div className="flex flex-col gap-1">
            <span className="font-bold text-on-surface-variant">
              Mô tả món ăn
            </span>
            <p className="text-on-surface bg-surface-bright p-3 rounded-xl border border-outline-variant min-h-15 max-h-30 overflow-y-auto whitespace-pre-line leading-relaxed">
              {dish.description || (
                <span className="text-neutral-400 italic">
                  Không có mô tả chi tiết cho món ăn này.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* FOOTER BUTTON CLOSING */}
        <div className="px-5 pb-5 pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-surface-variant text-on-surface hover:bg-surface-container rounded-xl font-bold transition-colors text-[13px]"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
