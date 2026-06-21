// apps/admin/src/features/users/components/users-table.tsx
"use client";

import React from "react";
import { UserResponse, UserStatus } from "@repo/core";

interface UsersTableProps {
  users: UserResponse[];
  onDelete: (id: string) => void;
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
  const getStatusClass = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case UserStatus.INACTIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800"; // PENDING
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 font-medium text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">Tên đăng nhập</th>
            <th className="px-6 py-3 text-left">Họ và tên</th>
            <th className="px-6 py-3 text-left">Vai trò (Roles)</th>
            <th className="px-6 py-3 text-left">Trạng thái</th>
            <th className="px-6 py-3 text-left">Ngày tạo</th>
            <th className="px-6 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-600">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                Không tìm thấy người dùng nào.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((r) => (
                      <span
                        key={r.name}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
                      >
                        {r.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(user.status)}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "---"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      if (confirm("Xóa nhân viên này?")) onDelete(user.id);
                    }}
                    className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Xóa mềm
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
