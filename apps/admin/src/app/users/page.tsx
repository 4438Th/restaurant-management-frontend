"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { UserTable } from "@/features/users/components/user-table";
import { UserToolbar } from "@/features/users/components/user-toolbar";
import { useUsers } from "@/features/users/users.hooks";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Hook React Query gọi thẳng dữ liệu unwrap sạch sẽ từ service
  const { data: pageData, isLoading } = useUsers(
    page,
    size,
    searchQuery || undefined,
    selectedStatus === "All" ? undefined : selectedStatus,
  );

  const usersList = pageData?.data || [];

  return (
    <div className="bg-surface text-on-surface h-screen flex w-full overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <nav className="hidden md:flex w-60 flex-col h-full bg-surface-container-lowest border-r border-outline-variant z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <span className="text-[18px] font-bold text-primary truncate">
            ProOps RMS
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="flex flex-col gap-1 px-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <Icon name="LayoutDashboard" className="w-5 h-5" />
                <span className="text-[12px] font-semibold">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="flex items-center gap-4 px-4 py-2 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/10 transition-colors"
              >
                <Icon name="UserCheck" className="w-5 h-5" />
                <span className="text-[12px] font-semibold">
                  User Management
                </span>
              </Link>
            </li>
          </ul>
        </div>
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

      {/* CONTENT ZONE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex justify-between items-center h-16 px-6 w-full bg-surface border-b border-outline-variant shadow-sm z-40 shrink-0">
          <span className="text-[18px] font-black text-on-surface">
            System Control
          </span>
          <button className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors">
            <Icon name="Plus" className="w-4 h-4" />
            <span className="text-[12px] font-semibold">Create User</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6">
          <div>
            <h1 className="text-[36px] font-bold tracking-[-0.02em] text-on-surface">
              User Management
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Configure credentials, tokens, and system access governance
              (RBAC).
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col shadow-sm overflow-hidden">
            <UserToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            <UserTable users={usersList} isLoading={isLoading} />

            {/* Điều hướng phân trang động */}
            {pageData && (
              <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-bright text-[14px] text-on-surface-variant">
                <div>
                  Showing Page {pageData.currentPage} of {pageData.totalPages} (
                  {pageData.totalElements} entries)
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50 text-[12px] font-medium"
                  >
                    Prev
                  </button>
                  <span className="px-3 text-[14px] font-semibold text-primary">
                    {page}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => (pageData.nextPageUrl ? p + 1 : p))
                    }
                    disabled={!pageData.nextPageUrl}
                    className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50 text-[12px] font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
