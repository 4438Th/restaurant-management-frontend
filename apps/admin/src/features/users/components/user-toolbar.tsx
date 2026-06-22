"use client";

import { Icon } from "@/components/ui/icon";
import { UserStatus } from "../users.types";

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
    <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-bright">
      {/* Tìm kiếm */}
      <div className="relative w-full sm:w-80">
        <Icon
          name="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 pointer-events-none"
        />
        <input
          className="w-full pl-10 pr-3 py-2 text-[14px] bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          placeholder="Search by name or username..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Bộ lọc trạng thái hệ thống */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="pl-3 pr-8 py-2 text-[14px] bg-surface-container-lowest border border-outline-variant rounded-lg outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value={UserStatus.ACTIVE}>Active</option>
          <option value={UserStatus.PENDING}>Pending</option>
          <option value={UserStatus.INACTIVE}>Inactive</option>
        </select>
      </div>
    </div>
  );
}
