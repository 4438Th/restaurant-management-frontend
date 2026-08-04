"use client";

import React from "react";
import { Icon } from "@repo/ui";

interface UserHeaderProps {
  onCreateClick: () => void;
}

export function UserHeader({ onCreateClick }: UserHeaderProps) {
  return (
    <header className="flex justify-between items-center h-16 px-6 w-full bg-surface border-b border-outline-variant shadow-sm z-10 shrink-0">
      <span className="text-[16px] font-bold text-on-surface tracking-tight">
        Tài khoản nhân sự
      </span>
      <button
        type="button"
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors cursor-pointer select-none"
      >
        <Icon name="Plus" className="w-4 h-4" />
        <span>Tạo mới</span>
      </button>
    </header>
  );
}
