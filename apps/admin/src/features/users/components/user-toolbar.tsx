// apps/admin/src/features/users/components/user-toolbar.tsx
"use client";

import { Icon } from "@/components/ui/icon";

interface UserToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function UserToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: UserToolbarProps) {
  return (
    <div className="p-4 flex flex-col sm:flex-row gap-3 bg-surface-bright border-b border-outline-variant items-center justify-between">
      {/* Ô tìm kiếm Username / FullName */}
      <div className="relative w-full sm:max-w-xs">
        <Icon
          name="Search"
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên hoặc tài khoản..."
          className="w-full pl-9 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Bộ lọc trạng thái hoạt động */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span className="text-[12px] font-bold text-on-surface-variant shrink-0">
          Trạng thái:
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-surface border border-outline-variant text-[13px] rounded-xl px-3 py-2 outline-none focus:border-primary font-medium min-w-30"
        >
          <option value="All">Tất cả</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PENDING">PENDING</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
    </div>
  );
}
