"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import {
  UserStatusLabel,
  UserRolesLabel,
  UserRoles,
  UserStatus,
} from "../users.types";

interface UserToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
}

export function UserToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedRole,
  onRoleChange,
}: UserToolbarProps) {
  // Tạo local state để quản lý text nhập tạm thời, tránh re-render liên tục và giật lag hệ thống
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Đồng bộ lại local search nếu bộ lọc tổng từ trang cha bị xóa/reset bên ngoài
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Xử lý Debounce tìm kiếm: Chờ người dùng dừng gõ 400ms mới kích hoạt gọi API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  return (
    <div className="p-4 flex flex-col sm:flex-row gap-3 bg-surface-bright border-b border-outline-variant items-center justify-between">
      {/* Ô tìm kiếm Username / FullName */}
      <div className="relative w-full sm:max-w-xs">
        <Icon
          name="Search"
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Tìm theo tên tài khoản hoặc họ tên..."
          className="w-full pl-9 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl outline-none focus:border-primary transition-colors text-on-surface font-medium placeholder:text-on-surface-variant/50"
        />
      </div>

      {/* Nhóm bộ lọc selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
        {/* Bộ lọc Vai trò */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[12px] font-bold text-on-surface-variant shrink-0">
            Vai trò:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-surface border border-outline-variant text-[13px] rounded-xl px-3 py-2 outline-none focus:border-primary font-medium text-on-surface min-w-40 cursor-pointer"
          >
            <option value="All">Tất cả vai trò</option>
            {(Object.keys(UserRolesLabel) as UserRoles[]).map((key) => (
              <option key={key} value={key}>
                {UserRolesLabel[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Bộ lọc trạng thái hoạt động */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[12px] font-bold text-on-surface-variant shrink-0">
            Trạng thái:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-surface border border-outline-variant text-[13px] rounded-xl px-3 py-2 outline-none focus:border-primary font-medium text-on-surface min-w-40 cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            {(Object.keys(UserStatusLabel) as UserStatus[])
              .filter((key) => key !== UserStatus.DELETED)
              .map((key) => (
                <option key={key} value={key}>
                  {UserStatusLabel[key]}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}
