import React from "react";
import { Outlet } from "react-router-dom";
import { Icon } from "@repo/ui";

interface AppLayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export function AppLayout({ title, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-indigo-600 selection:text-white">
      {/* Header hệ thống bếp */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Icon name="ChefHat" className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-wide">
              {title || "HTH KITCHEN DISPLAY SYSTEM"}
            </span>
            <span className="ml-3 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Online Realtime
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-600">
              Đã kết nối Backend
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">{children || <Outlet />}</main>
    </div>
  );
}
