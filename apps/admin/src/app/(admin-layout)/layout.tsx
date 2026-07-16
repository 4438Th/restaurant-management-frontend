"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/side-bar";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="bg-surface text-on-surface h-screen w-full flex overflow-hidden font-sans">
      {/* 1. LỚP NỀN MỜ (BACKDROP) KHI MỞ SIDEBAR TRÊN MOBILE */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
        />
      )}

      {/* 2. THANH ĐIỀU HƯỚNG BÊN TRÁI */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 h-full w-65 shrink-0 bg-surface shadow-lg border-r border-outline-variant transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-sm md:w-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </aside>

      {/* 3. PHẦN KHÔNG GIAN NỘI DUNG BÊN PHẢI */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* THANH ĐỈNH HỆ THỐNG */}
        <header className="h-16 w-full shrink-0 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 md:px-0">
          {/* NÚT TOGGLE MENU (Chỉ hiển thị trên thiết bị di động < md) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 mr-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Icon name="Menu" className="w-6 h-6" />
          </button>

          {/* Nội dung TopBar chính */}
          <div className="flex-1 h-full">
            <TopBar />
          </div>
        </header>

        {/* VÙNG NỘI DUNG ĐỘNG CỦA CÁC PAGE CON */}
        <div className="flex-1 w-full overflow-hidden relative flex flex-col">
          {children}
          <div id="root-portal"></div>
        </div>
      </div>
    </div>
  );
}
