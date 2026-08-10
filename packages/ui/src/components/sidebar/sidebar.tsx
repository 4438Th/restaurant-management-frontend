"use client";

import { Icon } from "../icon";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarProps } from "./types";

export function Sidebar({
  brandTitle,
  items,
  pathname,
  onLogout,
  isPendingLogout = false,
  renderLink,
}: SidebarProps) {
  return (
    <nav className="flex w-full flex-col h-full bg-surface-container-lowest">
      {/* BRAND HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <span className="text-[18px] font-black text-primary tracking-tight truncate">
          {brandTitle}
        </span>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-1 px-2">
          {items.map((item) => (
            <SidebarNavItem
              key={item.href || item.title}
              item={item}
              pathname={pathname}
              renderLink={renderLink}
            />
          ))}
        </ul>
      </div>

      {/* FOOTER LOGOUT */}
      <div className="p-2 border-t border-outline-variant">
        <button
          type="button"
          onClick={onLogout}
          disabled={isPendingLogout}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            name={isPendingLogout ? "Loader2" : "LogOut"}
            className={`w-5 h-5 ${isPendingLogout ? "animate-spin text-primary" : ""}`}
          />
          <span className="text-[12px] font-semibold">
            {isPendingLogout ? "Đang đăng xuất..." : "Logout"}
          </span>
        </button>
      </div>
    </nav>
  );
}
