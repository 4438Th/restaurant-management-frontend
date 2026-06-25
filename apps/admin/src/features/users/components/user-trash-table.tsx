"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { User } from "../users.types";
import { useRestoreUser } from "../users.hooks";

interface UserTrashTableProps {
  users: User[];
  isLoading: boolean;
  onRowClick?: (user: User) => void; // 🌟 Thêm nhận callback xử lý xem chi tiết hồ sơ
}

export function UserTrashTable({
  users,
  isLoading,
  onRowClick,
}: UserTrashTableProps) {
  const restoreMutation = useRestoreUser();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-on-surface-variant text-[13px]">
        Đang tải dữ liệu lưu trữ...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center text-on-surface-variant text-[13px]">
        Thùng rác trống.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-variant/30 text-on-surface-variant text-[11px] font-bold tracking-wider uppercase border-b border-outline-variant">
            <th className="p-4">Nhân viên</th>
            <th className="p-4">Tên đăng nhập</th>
            <th className="p-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant text-[13px]">
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => onRowClick?.(user)} // 🌟 Kích hoạt mở Modal khi click vào dòng
              className="hover:bg-surface-container-low transition-colors cursor-pointer select-none" // 🌟 Thêm con trỏ dạng pointer để báo hiệu click được
            >
              <td className="p-4 font-bold text-on-surface">{user.fullName}</td>
              <td className="p-4 text-on-surface-variant font-mono">
                {user.username}
              </td>
              <td className="p-4 text-right flex justify-end gap-2">
                {/* NÚT KHÔI PHỤC TÀI KHOẢN */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🌟 Chặn nổi bọt sự kiện, tránh mở nhầm Modal Profile khi bấm Khôi phục
                    restoreMutation.mutate(user.id);
                  }}
                  disabled={restoreMutation.isPending}
                  className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors flex items-center gap-1.5 text-[12px] font-bold disabled:opacity-40"
                  title="Khôi phục tài khoản"
                >
                  <Icon name="RotateCcw" className="w-4 h-4" />
                  <span>Khôi phục</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
