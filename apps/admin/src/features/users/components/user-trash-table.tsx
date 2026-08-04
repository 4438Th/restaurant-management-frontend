"use client";

import React from "react";
import { Icon } from "@repo/ui";
import { User } from "@repo/shared-features/users";
import { UserTrashTableRow } from "./user-trash-table-row";

export interface UserTrashTableProps {
  users: User[];
  isLoading: boolean;
  restoringUserId?: string | null;
  onRestoreClick?: (e: React.MouseEvent, user: User) => void;
  onRowClick?: (user: User) => void;
}

export function UserTrashTable({
  users,
  isLoading,
  restoringUserId,
  onRestoreClick,
  onRowClick,
}: UserTrashTableProps) {
  // 1. Trạng thái Loading (Skeleton Rows)
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto min-w-125">
          <thead>
            <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  disabled
                  className="rounded border-outline-variant text-primary"
                />
              </th>
              <th className="p-4">Nhân viên</th>
              <th className="p-4">Tên đăng nhập</th>
              <th className="p-4 w-40 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-4 text-center">
                  <div className="h-4 w-4 bg-surface-container-high rounded mx-auto" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-surface-container-high rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 w-28 bg-surface-container-high rounded" />
                      <div className="h-3 w-20 bg-surface-container-high rounded" />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="h-4 w-24 bg-surface-container-high rounded" />
                </td>
                <td className="p-4 text-right">
                  <div className="h-8 w-24 bg-surface-container-high rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 2. Trạng thái Thùng rác rỗng
  if (users.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-3">
          <Icon name="Trash2" className="w-6 h-6" />
        </div>
        <p className="text-on-surface font-medium text-sm">
          Thùng rác tài khoản trống
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          Không có tài khoản nhân viên nào trong danh mục đã xóa.
        </p>
      </div>
    );
  }

  // 3. Render Bảng dữ liệu
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-125">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="rounded border-outline-variant text-primary cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </th>
            <th className="p-4">Nhân viên</th>
            <th className="p-4">Tên đăng nhập</th>
            <th className="p-4 w-40 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant bg-surface-container-lowest">
          {users.map((user) => (
            <UserTrashTableRow
              key={user.id}
              user={user}
              isRestoring={restoringUserId === user.id}
              onRowClick={onRowClick}
              onRestoreClick={onRestoreClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
