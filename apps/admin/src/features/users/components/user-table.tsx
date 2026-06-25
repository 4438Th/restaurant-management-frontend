"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { User, UserStatus } from "../users.types";
import { useDeleteUser } from "../users.hooks";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditClick?: (user: User) => void;
  onRowClick?: (user: User) => void; // 🌟 Thêm prop để nhận callback xử lý xem chi tiết hồ sơ
}

export function UserTable({
  users,
  isLoading,
  onEditClick,
  onRowClick,
}: UserTableProps) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (e: React.MouseEvent, user: User) => {
    e.stopPropagation(); // 🌟 Chặn không cho kích hoạt sự kiện click dòng (mở Modal) khi bấm Xóa

    if (
      confirm(
        `Bạn có chắc chắn muốn xóa tài khoản "${user.username}" khỏi hệ thống không?`,
      )
    ) {
      deleteUserMutation.mutate(user.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant">
            <th className="p-4 w-12 text-center">
              <input
                className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                type="checkbox"
                onClick={(e) => e.stopPropagation()} // 🌟 Chặn nổi bọt cho checkbox header
              />
            </th>
            <th className="p-4">User Details</th>
            <th className="p-4">Username</th>
            <th className="p-4">Roles</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-on-surface-variant"
              >
                Loading application users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-on-surface-variant"
              >
                No system accounts found.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isDeletingThisUser =
                deleteUserMutation.isPending &&
                deleteUserMutation.variables === user.id;

              return (
                <tr
                  key={user.id}
                  onClick={() => onRowClick?.(user)} // 🌟 Kích hoạt mở Modal khi click vào bất kỳ vùng trống nào trên dòng
                  className="hover:bg-surface-container-low transition-colors cursor-pointer select-none" // 🌟 Thêm cursor-pointer báo hiệu dòng này bấm được
                >
                  <td className="p-4 text-center">
                    <input
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()} // 🌟 Chặn nổi bọt khi click chọn checkbox trên dòng
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">
                        {user.fullName
                          ? user.fullName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <div className="font-semibold">{user.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[13px] text-primary">
                    {user.username}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((roleName) => (
                          <span
                            key={roleName}
                            className="px-2 py-0.5 bg-primary-container/10 text-primary font-bold text-[11px] rounded border border-primary/20 uppercase tracking-wider"
                          >
                            {roleName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[12px] text-on-surface-variant italic">
                          No Roles Assigned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                        user.status === UserStatus.ACTIVE
                          ? "bg-green-600/10 text-green-600"
                          : user.status === UserStatus.PENDING
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-error/10 text-error"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {/* Nút Sửa */}
                    {onEditClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(user);
                        }}
                        disabled={deleteUserMutation.isPending}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors rounded-xl disabled:opacity-40"
                        title="Chỉnh sửa tài khoản"
                      >
                        <Icon name="Pencil" className="w-4 h-4" />
                      </button>
                    )}

                    {/* Nút Xóa */}
                    <button
                      onClick={(e) => handleDelete(e, user)}
                      disabled={deleteUserMutation.isPending}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors rounded-xl disabled:opacity-40"
                      title="Xóa tài khoản"
                    >
                      {isDeletingThisUser ? (
                        <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon name="Trash2" className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
