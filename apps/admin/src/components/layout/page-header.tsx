"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ComponentProps } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  isTrash?: boolean;
  backLink?: string;

  buttonText?: string;
  buttonIcon?: ComponentProps<typeof Icon>["name"];
  onButtonClick?: () => void;
  trashLink?: string;
}

export function PageHeader({
  title,
  description,
  isTrash = false,
  backLink,
  buttonText,
  buttonIcon = "Plus",
  onButtonClick,
  trashLink,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center shrink-0 gap-4 w-full">
      {/* KHU VỰC TIÊU ĐỀ */}
      <div className="min-w-0">
        <h1
          className={`text-[24px] sm:text-[28px] font-black tracking-tight flex items-center gap-2 sm:gap-3 truncate ${
            isTrash ? "text-error" : "text-on-surface"
          }`}
        >
          {/* Nếu là trang Thùng rác, tự động chèn Icon rác to sắc nét phía trước */}
          {isTrash && (
            <Icon
              name="Trash2"
              className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-error"
            />
          )}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-[13px] sm:text-[14px] text-on-surface-variant mt-1 line-clamp-2 sm:line-clamp-none">
            {description}
          </p>
        )}
      </div>

      {/* KHU VỰC HÀNH ĐỘNG (BUTTONS) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* NÚT THÊM MỚI (Chỉ hiển thị khi có đầy đủ text và hàm click) */}
        {buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            title={buttonText}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/90 p-2.5 sm:px-4 sm:py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name={buttonIcon} className="w-4 h-4" />
            <span className="hidden sm:inline">{buttonText}</span>
          </button>
        )}

        {/* NÚT ĐƯỜNG DẪN TỚI THÙNG RÁC */}
        {trashLink && (
          <Link
            href={trashLink}
            title="Thùng rác"
            className="flex items-center justify-center gap-2 border border-outline-variant hover:bg-surface-container text-on-surface p-2.5 sm:px-4 sm:py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name="Trash2" className="w-4 h-4 text-error" />
            <span className="hidden sm:inline">Thùng rác</span>
          </Link>
        )}

        {/* NÚT QUAY LẠI */}
        {backLink && (
          <Link
            href={backLink}
            title="Quay lại"
            className="flex items-center justify-center gap-2 bg-surface-variant hover:bg-surface-container text-on-surface p-2.5 sm:px-4 sm:py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Link>
        )}
      </div>
    </div>
  );
}
