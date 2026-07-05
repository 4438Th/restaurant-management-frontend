import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Quản lý danh mục món ăn | Admin Dashboard",
  description: "Hệ thống quản lý cấu trúc danh mục thực đơn nhà hàng",
};

interface MenuCategoriesLayoutProps {
  children: React.ReactNode;
}

export default function MenuCategoriesLayout({
  children,
}: MenuCategoriesLayoutProps) {
  return (
    <div className="flex flex-col flex-1 w-full min-h-screen bg-surface-container-lowest">
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
