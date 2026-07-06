"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { User, UserStatus } from "../users.types";
import { useDeleteUser } from "../users.hooks";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditClick?: (user: User) => void;
  onRowClick?: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  onEditClick,
  onRowClick,
}: UserTableProps) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    if (
      confirm(
        `Bạn có chắc chắn muốn tạm dừng tài khoản "${user.username}" không?`,
      )
    ) {
      deleteUserMutation.mutate(user.id);
    }
  };

  // Hàm helper map màu sắc động dựa trên chính xác 4 trạng thái của UserStatus Enum
  const getStatusStyle = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-600/10 text-green-600";
      case UserStatus.PENDING:
        return "bg-blue-500/10 text-blue-500";
      case UserStatus.INACTIVE:
        return "bg-amber-500/10 text-amber-500";
      case UserStatus.DELETED:
        return "bg-error/10 text-error";
      default:
        return "bg-on-surface/10 text-on-surface-variant";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse table-auto min-w-175">
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
            <th className="p-4">Vai trò</th>
            <th className="p-4 w-28 text-center">Trạng thái</th>
            <th className="p-4 w-28 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Không tìm thấy tài khoản nào phù hợp.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isDeleting =
                deleteUserMutation.isPending &&
                deleteUserMutation.variables === user.id;
              return (
                <tr
                  key={user.id}
                  onClick={() => onRowClick?.(user)}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer select-none"
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{user.fullName}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[13px] text-primary">
                    {user.username}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 bg-primary-container/10 text-primary font-bold text-[11px] rounded border border-primary/20 uppercase"
                        >
                          {role}
                        </span>
                      )) || (
                        <span className="text-[12px] text-on-surface-variant italic">
                          Chưa phân quyền
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td
                    className="p-4 text-right flex justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEditClick && (
                      <button
                        onClick={() => onEditClick(user)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        <Icon name="Pencil" className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, user)}
                      disabled={isDeleting}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors"
                    >
                      {isDeleting ? (
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
