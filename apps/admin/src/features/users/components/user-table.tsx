"use client";

import { Icon } from "@/components/ui/icon";
import { User, UserStatus } from "../users.types";
import { useDeleteUser } from "../users.hooks";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditClick?: (user: User) => void;
}

export function UserTable({ users, isLoading, onEditClick }: UserTableProps) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (user: User) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa tài khoản "${user.username}" khỏi hệ thống không?`,
      )
    ) {
      // 🌟 Gọi mutate trực tiếp. Mọi thông báo Thành công / Thất bại
      // đã được lo trọn gói bởi Sonner Toast đặt bên trong Custom Hook.
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
              // Định nghĩa logic loading cục bộ cho riêng dòng đang bấm xóa
              const isDeletingThisUser =
                deleteUserMutation.isPending &&
                deleteUserMutation.variables === user.id;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="p-4 text-center">
                    <input
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      type="checkbox"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">
                        {user.fullName.charAt(0)}
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
                        onClick={() => onEditClick(user)}
                        disabled={deleteUserMutation.isPending}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors rounded-xl disabled:opacity-40"
                        title="Chỉnh sửa"
                      >
                        <Icon name="Pencil" className="w-4 h-4" />
                      </button>
                    )}

                    {/* Nút Xóa */}
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deleteUserMutation.isPending}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors rounded-xl disabled:opacity-40"
                      title="Xóa tài khoản"
                    >
                      {isDeletingThisUser ? (
                        // Hiển thị trạng thái spinner nhỏ khi dòng này đang được xử lý xóa
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
