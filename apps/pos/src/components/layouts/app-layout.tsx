import React, { useState } from "react";
import { Sidebar } from "./side-bar";
import { PageHeader } from "./page-header";

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
}

export function AppLayout({ children, title, actionButton }: AppLayoutProps) {
  // isSidebarOpen quản lý trạng thái đóng/mở Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface text-on-surface font-sans">
      {/* 1. BACKDROP MỜ KHI MỞ SIDEBAR TRÊN MÀN HÌNH NHỎ / TABLET */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
        />
      )}

      {/* 2. SIDEBAR TRƯỢT SANG (DRAWER SLIDE EFFECT) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 h-full w-64 shrink-0 bg-surface shadow-lg border-r border-outline-variant transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:w-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar isCollapsed={false} onToggle={() => setIsSidebarOpen(false)} />
      </aside>

      {/* 3. PHẦN KHÔNG GIAN NỘI DUNG BÊN PHẢI */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {/* HEADER CHÍNH CÓ TÍNH NĂNG TOGGLE SIDEBAR */}
        <header className="flex h-16 shrink-0 items-center border-b border-outline-variant bg-surface-container-lowest px-4">
          {/* NÚT TOGGLE MENU (Hiển thị khi màn hình nhỏ hơn lg) */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="lg:hidden p-2 mr-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            aria-label="Toggle Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* PageHeader Component */}
          <div className="flex-1">
            <PageHeader title={title} actionButton={actionButton} />
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
