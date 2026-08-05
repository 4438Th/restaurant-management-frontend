"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@repo/ui";
import { NavItem } from "./nav-items";

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
}

export function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  // Hàm kiểm tra active đường dẫn chuẩn xác (Xử lý riêng cho trang chủ '/')
  const checkIsActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Kiểm tra nếu route hiện tại khớp với bất kỳ menu con nào
  const isParentActive = item.children?.some((child) =>
    checkIsActive(child.href),
  );

  // Mặc định mở dropdown nếu đang ở trong route con
  const [isOpen, setIsOpen] = useState<boolean>(!!isParentActive);

  const activeStyle =
    "text-primary font-bold border-r-4 border-primary bg-primary-container/10";
  const inactiveStyle =
    "text-on-surface-variant hover:bg-surface-container hover:text-on-surface";

  // Nhóm Menu có danh sách con (Dropdown)
  if (item.children && item.children.length > 0) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
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
            {item.children.map((subItem) => (
              <li key={subItem.href || subItem.title}>
                <Link
                  href={subItem.href || "#"}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                    checkIsActive(subItem.href) ? activeStyle : inactiveStyle
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
          checkIsActive(item.href) ? activeStyle : inactiveStyle
        }`}
      >
        <Icon name={item.icon} className="w-5 h-5" />
        <span className="text-[12px] font-semibold">{item.title}</span>
      </Link>
    </li>
  );
}
