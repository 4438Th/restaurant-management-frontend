"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@repo/ui";

// Bộ từ điển để dịch URL slug sang tiếng Việt tương ứng với menu của ông giáo
const routeLabels: Record<string, string> = {
  admin: "Tổng quan",
  users: "Tài khoản nhân viên",
  trash: "Thùng rác",
  settings: "Cài đặt",
  restaurants: "Nhà hàng",
  menu: "Thực đơn",
  categories: "Danh mục",
  dishes: "Món ăn",
  tables: "Bàn ăn",
  orders: "Đơn hàng",
  bills: "Hóa đơn",
};

export function TopBar() {
  const pathname = usePathname();

  // Bẻ URL thành các phần tử mảng, bỏ qua các khoảng trống trống
  // Ví dụ: "/admin/users/trash" -> ["admin", "users", "trash"]
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div className="h-full w-full px-6 flex items-center justify-between bg-surface-container-lowest">
      {/* BÊN TRÁI: Thanh điều hướng Breadcrumb tự động */}
      <nav className="flex items-center gap-1.5 text-[13px] font-medium text-on-surface-variant select-none">
        {/* Nút Home mặc định */}
        <Link
          href="/admin"
          className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="LayoutDashboard" className="w-4 h-4" />
        </Link>

        {pathSegments.map((segment, index) => {
          // Bỏ qua chữ "admin" đầu tiên nếu ông giáo không muốn lặp chữ "Tổng quan" ở mọi trang
          if (segment === "admin" && index === 0) return null;

          // Xây dựng đường dẫn URL tăng dần: /admin -> /admin/users -> /admin/users/trash
          const routeUrl = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const label = routeLabels[segment] || segment; // Không có trong từ điển thì fallback lấy luôn slug

          return (
            <React.Fragment key={routeUrl}>
              {/* Dấu mũi tên phân cách */}
              <Icon name="ChevronRight" className="w-3.5 h-3.5 text-outline" />

              {isLast ? (
                // Trang hiện tại: Chữ đậm, không có link bấm
                <span className="font-bold text-on-surface">{label}</span>
              ) : (
                // Các trang cha: Cho phép click để quay lại nhanh
                <Link
                  href={routeUrl}
                  className="hover:text-primary hover:underline transition-all"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* BÊN PHẢI: Các nút tiện ích & Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors relative">
          <Icon name="Bell" className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <div className="h-6 w-px bg-outline-variant" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[13px] font-bold text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
            AD
          </div>
          <span className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors">
            Quản trị viên
          </span>
        </div>
      </div>
    </div>
  );
}
