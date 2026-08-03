"use client";

import React from "react";
import { Icon } from "@/components/ui";
import { User } from "@repo/shared-features/users";
import { useRestoreUser } from "@repo/shared-features/users";

interface UserTrashTableProps {
  users: User[];
  isLoading: boolean;
  onRowClick?: (user: User) => void;
}

export function UserTrashTable({
  users,
  isLoading,
  onRowClick,
}: UserTrashTableProps) {
  const restoreMutation = useRestoreUser();

  const handleRestore = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    restoreMutation.mutate(userId);
  };

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
            <th className="p-4 w-32 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Đang tải dữ liệu thùng rác...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-on-surface-variant text-[13px]"
              >
                Thùng rác trống.
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isRestoring =
                restoreMutation.isPending &&
                restoreMutation.variables === user.id;

              return (
                <tr
                  key={user.id}
                  onClick={() => !isRestoring && onRowClick?.(user)}
                  className={`transition-colors border-b border-outline-variant select-none ${
                    isRestoring
                      ? "bg-surface-container-low opacity-50 pointer-events-none"
                      : "hover:bg-surface-container-low cursor-pointer"
                  }`}
                >
                  <td
                    className="p-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      disabled={isRestoring}
                      className="rounded border-outline-variant text-primary cursor-pointer disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{user.fullName}</div>
                  </td>
                  <td className="p-4 font-mono text-[13px] text-primary">
                    {user.username}
                  </td>
                  <td
                    className="p-4 text-right flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleRestore(e, user.id)}
                      disabled={isRestoring}
                      className="px-3 py-1.5 text-success hover:bg-success/10 rounded-xl transition-colors flex items-center gap-1.5 text-[12px] font-bold disabled:opacity-40 disabled:pointer-events-none select-none min-w-25 justify-center"
                    >
                      {isRestoring ? (
                        <>
                          <div className="w-4 h-4 border-2 border-success border-t-transparent rounded-full animate-spin" />
                          <span>Đang xử lý</span>
                        </>
                      ) : (
                        <>
                          <Icon name="RotateCcw" className="w-4 h-4" />
                          <span>Khôi phục</span>
                        </>
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
