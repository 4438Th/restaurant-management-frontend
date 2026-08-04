"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { User } from "@repo/shared-features/users";

interface UserTrashTableRowProps {
  user: User;
  isRestoring: boolean;
  onRowClick?: (user: User) => void;
  onRestoreClick?: (e: React.MouseEvent, user: User) => void;
}

export function UserTrashTableRow({
  user,
  isRestoring,
  onRowClick,
  onRestoreClick,
}: UserTrashTableRowProps) {
  return (
    <tr
      onClick={() => !isRestoring && onRowClick?.(user)}
      className={`transition-colors border-b border-outline-variant select-none ${
        isRestoring
          ? "bg-surface-container-low opacity-50 pointer-events-none"
          : "hover:bg-surface-container-low cursor-pointer"
      }`}
    >
      {/* Checkbox */}
      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          disabled={isRestoring}
          className="rounded border-outline-variant text-primary cursor-pointer disabled:cursor-not-allowed"
        />
      </td>

      {/* Thông tin nhân viên */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {user.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-semibold text-on-surface text-sm">
              {user.fullName || "Chưa cập nhật"}
            </div>
            {user.email && (
              <div className="text-xs text-on-surface-variant">
                {user.email}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Tên đăng nhập */}
      <td className="p-4 font-mono text-[13px] text-primary">
        @{user.username}
      </td>

      {/* Thao tác */}
      <td className="p-4 text-right">
        <div
          className="flex justify-end items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => onRestoreClick?.(e, user)}
            disabled={isRestoring}
            className="px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-600/10 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
          >
            {isRestoring ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin text-emerald-600 dark:text-emerald-400" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Icon name="RotateCcw" className="w-4 h-4" />
                <span>Khôi phục</span>
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
