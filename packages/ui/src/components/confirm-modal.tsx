"use client";

import React from "react";
import { Icon } from "./icon";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "primary";
  isLoading?: boolean;
}

// 1. Định nghĩa Config Object bên ngoài component với `as const`
const VARIANT_CONFIG = {
  danger: {
    icon: "Trash2",
    iconBg: "bg-error/10 text-error",
    btnConfirm: "bg-error hover:bg-error/90 text-white",
  },
  warning: {
    icon: "AlertTriangle",
    iconBg: "bg-amber-500/10 text-amber-600",
    btnConfirm: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  info: {
    icon: "HelpCircle",
    iconBg: "bg-primary/10 text-primary",
    btnConfirm: "bg-primary hover:bg-primary/90 text-on-primary",
  },
  primary: {
    icon: "LogOut", // Hoặc "ShieldAlert", "Lock" tùy icon bạn muốn
    iconBg: "bg-primary/10 text-primary",
    btnConfirm: "bg-primary hover:bg-primary/90 text-on-primary",
  },
} as const;

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // 2. Lấy config dựa theo variant
  const variantStyles = VARIANT_CONFIG[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-outline-variant rounded-2xl p-6 max-w-sm w-full shadow-xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${variantStyles.iconBg}`}>
            {/* variantStyles.icon lúc này sẽ chuẩn Type 'Trash2' | 'AlertTriangle' | 'HelpCircle' */}
            <Icon name={variantStyles.icon} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-base">{title}</h3>
            {description && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Nội dung chi tiết */}
        {message && (
          <div className="text-sm text-on-surface leading-relaxed">
            {message}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface bg-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer ${variantStyles.btnConfirm}`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
