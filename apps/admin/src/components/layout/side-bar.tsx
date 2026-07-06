// apps/admin/src/components/layout/sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

export function Sidebar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const activeStyle =
    "text-primary font-bold border-r-4 border-primary bg-primary-container/10";
  const inactiveStyle =
    "text-on-surface-variant hover:bg-surface-container hover:text-on-surface";

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
          {/* 1. USER MANAGEMENT */}
          <li>
            <Link
              href="/users"
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
                isActive("/users") ? activeStyle : inactiveStyle
              }`}
            >
              <Icon name="UserCheck" className="w-5 h-5" />
              <span className="text-[12px] font-semibold">
                Quản lý người dùng
              </span>
            </Link>
          </li>

          {/* 2. MENU MANAGEMENT (DROPDOWN GROUP) */}
          <li>
            {/* Nút bấm cha để đóng/mở nhanh cụm Menu Thực Đơn */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors ${
                isActive("/menu")
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon name="Utensils" className="w-5 h-5" />
                <span className="text-[12px] font-semibold">Quản lý menu</span>
              </div>
              <Icon
                name="ChevronDown"
                className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Khối chứa danh sách menu con */}
            {isMenuOpen && (
              <ul className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                <li>
                  <Link
                    href="/menu/items"
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                      isActive("/menu/items") || pathname === "/menu"
                        ? activeStyle
                        : inactiveStyle
                    }`}
                  >
                    <Icon name="Beef" className="w-4 h-4" />
                    <span className="text-[12px] font-medium">
                      Danh sách món ăn
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu/categories"
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                      isActive("/menu/categories") ? activeStyle : inactiveStyle
                    }`}
                  >
                    <Icon name="Layers" className="w-4 h-4" />
                    <span className="text-[12px] font-medium">
                      Danh mục món ăn
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* FOOTER LOGOUT */}
      <div className="p-2 border-t border-outline-variant">
        <Link
          href="/logout"
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <Icon name="LogOut" className="w-5 h-5" />
          <span className="text-[12px] font-semibold">Logout</span>
        </Link>
      </div>
    </nav>
  );
}
