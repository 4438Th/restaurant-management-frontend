"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { User, UserStatusLabel } from "@repo/shared-features/users";

interface UserTableRowProps {
  user: User;
  isDeleting: boolean;
  onEditClick?: (user: User) => void;
  onRowClick?: (user: User) => void;
  onDeleteClick: (e: React.MouseEvent, user: User) => void;
}

export function UserTableRow({
  user,
  isDeleting,
  onEditClick,
  onRowClick,
  onDeleteClick,
}: UserTableRowProps) {
  // Đồng bộ màu sắc theo đúng logic form trạng thái
  const getStatusStyle = (statusKey: string) => {
    switch (statusKey) {
      case "ACTIVE":
        return "bg-green-600/10 text-green-600 border border-green-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "INACTIVE":
      case "DELETED":
        return "bg-error/10 text-error border border-error/20";
      default:
        return "bg-on-surface/5 text-on-surface-variant border border-outline-variant";
    }
  };

  return (
    <tr
      onClick={() => !isDeleting && onRowClick?.(user)}
      className={`transition-colors border-b border-outline-variant select-none ${
        isDeleting
          ? "bg-surface-container-low opacity-50 pointer-events-none"
          : "hover:bg-surface-container-low cursor-pointer"
      }`}
    >
      <td className="p-4">
        <div className="font-semibold">{user.fullName}</div>
      </td>
      <td className="p-4 font-mono text-[13px] text-primary">
        {user.username}
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 bg-primary-container/10 text-primary font-bold text-[11px] rounded border border-primary/20 uppercase"
              >
                {role}
              </span>
            ))
          ) : (
            <span className="text-[12px] text-on-surface-variant italic">
              Chưa phân quyền
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(
            user.status,
          )}`}
        >
          {UserStatusLabel[user.status] || user.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div
          className="flex justify-end items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {onEditClick && (
            <button
              onClick={() => onEditClick(user)}
              disabled={isDeleting}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Chỉnh sửa"
            >
              <Icon name="Pencil" className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => onDeleteClick(e, user)}
            disabled={isDeleting}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors flex items-center justify-center min-w-8 disabled:opacity-30 disabled:pointer-events-none"
            title="Xóa tài khoản"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="Trash2" className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
