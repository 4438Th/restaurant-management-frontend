"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useUsersTrash } from "@/features/users/users.hooks";
import { UserTrashTable } from "@/features/users/components/user-trash-table";
import { UserProfileModal } from "@/features/users/components/user-profile-modal"; // 🌟 Import Modal chi tiết hồ sơ
import { User } from "@/features/users/users.types";

export default function UserTrashPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // 🌟 State quản lý đóng/mở Modal hồ sơ cá nhân trong thùng rác
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: pageData, isLoading: isFetchLoading } = useUsersTrash(
    page,
    size,
    debouncedSearch || undefined,
  );

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  // 🌟 Xử lý sự kiện khi click chọn một dòng trong thùng rác để xem thông tin
  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setIsProfileOpen(true);
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
          <span className="text-[14px] font-medium text-on-surface-variant flex items-center gap-1">
            <Link
              href="/users"
              className="hover:text-primary transition-colors"
            >
              Tài khoản
            </Link>
            <Icon name="ChevronRight" className="w-4 h-4" />
            <span>Thùng rác</span>
          </span>

          {/* Nút quay lại danh sách chính */}
          <Link
            href="/users"
            className="flex items-center gap-2 bg-surface-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>Quay lại</span>
          </Link>
        </header>

        {/* MAIN BODY APP */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-error flex items-center gap-3">
              <Icon name="Trash2" className="w-8 h-8" />
              Thùng rác lưu trữ
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Danh sách nhân sự đã tạm dừng hoạt động. Bạn có thể khôi phục lại
              quyền truy cập.
            </p>
          </div>

          {/* TABLE CARD */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
            {/* Ô tìm kiếm nhanh trong thùng rác */}
            <div className="p-4 border-b border-outline-variant bg-surface-bright flex gap-4">
              <div className="relative flex-1 max-w-sm">
                <Icon
                  name="Search"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài khoản đã xóa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-surface border border-outline-variant rounded-xl focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* BẢNG RIÊNG CHO THÙNG RÁC */}
            <UserTrashTable
              users={trashList}
              isLoading={isFetchLoading}
              onRowClick={handleRowClick}
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
                    className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container disabled:opacity-40 text-[12px] font-bold"
                  >
                    Trước
                  </button>
                  <span className="px-3 text-[13px] font-black text-primary">
                    {page}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container disabled:opacity-40 text-[12px] font-bold"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🌟 USER PROFILE MODAL (Dùng chung cho cả trang Trash) */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
