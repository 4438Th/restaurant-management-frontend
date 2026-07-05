"use client";

import React from "react";
import { Sidebar } from "@/components/layout/side-bar";
import { TopBar } from "@/components/layout/top-bar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-surface text-on-surface h-screen w-full flex overflow-hidden font-sans">
      {/* 1. THANH ĐIỀU HƯỚNG BÊN TRÁI */}
      <aside className="h-full shrink-0 z-20 shadow-sm border-r border-outline-variant">
        <Sidebar />
      </aside>

      {/* 2. PHẦN KHÔNG GIAN NỘI DUNG BÊN PHẢI */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* THANH ĐỈNH HỆ THỐNG */}
        <header className="h-16 w-full shrink-0 border-b border-outline-variant bg-surface-container-lowest">
          <TopBar />
        </header>

        {/* VÙNG NỘI DUNG ĐỘNG CỦA CÁC PAGE CON */}
        <div className="flex-1 w-full overflow-hidden relative flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
