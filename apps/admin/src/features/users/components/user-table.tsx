"use client";

import React from "react";
import { User } from "@repo/shared-features/users";
import { UserTableRow } from "./user-table-row";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditClick?: (user: User) => void;
  onDeleteClick?: (user: User) => void; // Thêm callback xóa user
  onRowClick?: (user: User) => void;
  deletingUserId?: string | null; // (Tùy chọn) Truyền ID user đang trong trạng thái loading xóa
}

export function UserTable({
  users,
  isLoading,
  onEditClick,
  onDeleteClick,
  onRowClick,
  deletingUserId,
}: UserTableProps) {
  const handleDelete = (e: React.MouseEvent, user: User) => {
    e.stopPropagation(); // Tránh kích hoạt sự kiện click dòng (onRowClick)
    onDeleteClick?.(user);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-175">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant sticky top-0 z-10">
            <th className="p-4">Nhân viên</th>
            <th className="p-4">Tên đăng nhập</th>
            <th className="p-4">Vai trò</th>
            <th className="p-4 w-32 text-center">Trạng thái</th>
            <th className="p-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Không tìm thấy tài khoản nào phù hợp.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isDeleting={deletingUserId === user.id}
                onEditClick={onEditClick}
                onRowClick={onRowClick}
                onDeleteClick={(e) => handleDelete(e, user)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
