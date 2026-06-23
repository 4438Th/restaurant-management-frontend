"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { UserForm } from "./user-form";

export function UserManagementHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-outline-variant">
      <div>
        <h1 className="text-[24px] font-black tracking-tight text-on-surface">
          Tài khoản & Phân quyền
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Quản lý phân quyền RBAC và trạng thái làm việc của nhân sự.
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold bg-surface-bright border border-outline-variant hover:bg-surface-variant rounded-xl text-on-surface transition-colors">
          <Icon name="Download" className="w-4 h-4" />
          Xuất báo cáo
        </button>

        {/* Nút kích hoạt mở Drawer Create User */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-[14px] font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm transition-colors"
        >
          <Icon name="Plus" className="w-4 h-4" />
          Thêm tài khoản
        </button>
      </div>

      {/* Khai báo Drawer đóng/mở chủ động */}
      <UserForm isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
