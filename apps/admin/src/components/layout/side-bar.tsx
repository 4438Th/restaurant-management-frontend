"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@repo/ui";
import { useLogout } from "@repo/shared-features/auth";
import { sidebarNavItems } from "./nav-items";
import { SidebarNavItem } from "./sidebar-nav-item";

export function Sidebar() {
  const pathname = usePathname();
  const { mutate: executeLogout, isPending } = useLogout();

  const handleLogout = () => {
    executeLogout(undefined, {
      onSettled: () => {
        window.location.href = "/login";
      },
    });
  };

  return (
    <nav className="flex w-full flex-col h-full bg-surface-container-lowest">
      {/* BRAND HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <span className="text-[18px] font-black text-primary tracking-tight truncate">
          HTH RMS
        </span>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-1 px-2">
          {sidebarNavItems.map((item) => (
            <SidebarNavItem
              key={item.href || item.title}
              item={item}
              pathname={pathname}
            />
          ))}
        </ul>
      </div>

      {/* FOOTER LOGOUT */}
      <div className="p-2 border-t border-outline-variant">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            name={isPending ? "Loader2" : "LogOut"}
            className={`w-5 h-5 ${isPending ? "animate-spin text-primary" : ""}`}
          />
          <span className="text-[12px] font-semibold">
            {isPending ? "Đang đăng xuất..." : "Logout"}
          </span>
        </button>
      </div>
    </nav>
  );
}
