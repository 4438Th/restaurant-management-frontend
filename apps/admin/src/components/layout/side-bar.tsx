"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { sidebarNavItems, NavItem } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

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
          {sidebarNavItems.map((item, index) => (
            <SidebarNavItem key={index} item={item} pathname={pathname} />
          ))}
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

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
}

function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  // Kiểm tra nếu route hiện tại khớp với bất kỳ menu con nào
  const isParentActive = item.children?.some(
    (child) => child.href && pathname.startsWith(child.href),
  );

  // Mặc định mở dropdown nếu đang ở trong route con
  const [isOpen, setIsOpen] = useState<boolean>(!!isParentActive);

  const isActive = (path?: string) =>
    Boolean(path && pathname.startsWith(path));

  const activeStyle =
    "text-primary font-bold border-r-4 border-primary bg-primary-container/10";
  const inactiveStyle =
    "text-on-surface-variant hover:bg-surface-container hover:text-on-surface";

  // Nhóm Menu có danh sách con (Dropdown)
  if (item.children && item.children.length > 0) {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors ${
            isParentActive
              ? "text-primary font-bold"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <div className="flex items-center gap-4">
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="text-[12px] font-semibold">{item.title}</span>
          </div>
          <Icon
            name="ChevronDown"
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul className="mt-1 flex flex-col gap-1 pl-9 pr-2">
            {item.children.map((subItem, idx) => (
              <li key={idx}>
                <Link
                  href={subItem.href || "#"}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive(subItem.href) ? activeStyle : inactiveStyle
                  }`}
                >
                  <Icon name={subItem.icon} className="w-4 h-4" />
                  <span className="text-[12px] font-medium">
                    {subItem.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Menu đơn lẻ
  return (
    <li>
      <Link
        href={item.href || "#"}
        className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
          isActive(item.href) ? activeStyle : inactiveStyle
        }`}
      >
        <Icon name={item.icon} className="w-5 h-5" />
        <span className="text-[12px] font-semibold">{item.title}</span>
      </Link>
    </li>
  );
}
