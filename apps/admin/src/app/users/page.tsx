"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { UserTable } from "@/features/users/components/user-table";
import { UserToolbar } from "@/features/users/components/user-toolbar";
import { UserForm } from "@/features/users/components/user-form";
import { useUsers } from "@/features/users/users.hooks";
import { User } from "@/features/users/users.types";

export default function UserManagementPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // State điều khiển đóng/mở form và lưu thông tin tài khoản đang chỉnh sửa
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Kỹ thuật Debounce: Giảm tần suất gọi API liên tục khi người dùng đang nhập từ khóa
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Quay về trang 1 khi phát sinh từ khóa tìm kiếm mới
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Hook React Query lấy danh sách dữ liệu phân trang từ Server
  const { data: pageData, isLoading: isFetchLoading } = useUsers(
    page,
    size,
    debouncedSearch || undefined,
    selectedStatus === "All" ? undefined : selectedStatus,
  );

  const usersList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  // Xử lý sự kiện khi ấn nút "Thêm tài khoản" từ Header chính
  const handleCreateClick = (): void => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  // Xử lý sự kiện khi bấm nút Chỉnh sửa trên từng dòng của bảng dữ liệu
  const handleEditClick = (user: User): void => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex w-full overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <nav className="hidden md:flex w-60 flex-col h-full bg-surface-container-lowest border-r border-outline-variant z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant">
          <span className="text-[18px] font-black text-primary tracking-tight truncate">
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
        {/* TOP BAR PANEL */}
        <header className="flex justify-between items-center h-16 px-6 w-full bg-surface border-b border-outline-variant shadow-sm z-10 shrink-0">
          <span className="text-[16px] font-bold text-on-surface tracking-tight">
            Hệ thống kiểm soát (RBAC)
          </span>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name="Plus" className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </header>

        {/* MAIN BODY APP */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-on-surface">
              Tài khoản & Phân quyền
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Quản lý danh sách nhân sự, mã hóa thông tin và phân định quyền
              hạn.
            </p>
          </div>

          {/* TABLE CONTAINER CARD */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
            <UserToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStatus={selectedStatus}
              onStatusChange={(status: string) => {
                setSelectedStatus(status);
                setPage(1);
              }}
            />

            {/* Bảng danh sách */}
            <UserTable
              users={usersList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
            />

            {/* PHÂN TRANG */}
            {pageData && (
              <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-bright text-[13px] text-on-surface-variant font-medium">
                <div>
                  Hiển thị trang{" "}
                  <span className="text-on-surface font-bold">
                    {pageData.currentPage}
                  </span>{" "}
                  trên{" "}
                  <span className="text-on-surface font-bold">
                    {pageData.totalPages}
                  </span>{" "}
                  ({pageData.totalElements} tài khoản)
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 text-[12px] font-bold"
                  >
                    Trước
                  </button>
                  <span className="px-3 text-[13px] font-black text-primary">
                    {page}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 text-[12px] font-bold"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FORM MODAL DRAWER*/}
      <UserForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
