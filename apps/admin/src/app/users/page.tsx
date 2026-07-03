"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Sidebar } from "@/components/layout/sidebar";
import { UserHeader } from "@/features/users/components/user-header";
import { UserPagination } from "@/features/users/components/user-pagination";
import { UserTable } from "@/features/users/components/user-table";
import { UserToolbar } from "@/features/users/components/user-toolbar";
import { UserForm } from "@/features/users/components/user-form";
import { UserProfileModal } from "@/features/users/components/user-profile-modal";
import { useUsers } from "@/features/users/users.hooks";
import { User } from "@/features/users/users.types";

export default function UserManagementPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: pageData, isLoading: isFetchLoading } = useUsers(
    page,
    size,
    debouncedSearch || undefined,
    selectedStatus === "All" ? undefined : selectedStatus,
  );

  const usersList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleCreateClick = (): void => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (user: User): void => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex w-full overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar />

      {/* CONTENT ZONE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP BAR PANEL */}
        <UserHeader onCreateClick={handleCreateClick} />

        {/* MAIN BODY APP */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[28px] font-black tracking-tight text-on-surface">
                Danh sách tài khoản
              </h1>
              <p className="text-[14px] text-on-surface-variant mt-1">
                Quản lý hồ sơ nhân sự và phân quyền truy cập hệ thống.
              </p>
            </div>
            <Link
              href="/users/trash"
              className="flex items-center gap-2 border border-outline-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
            >
              <Icon name="Trash2" className="w-4 h-4 text-error" />
              <span>Thùng rác</span>
            </Link>
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

            <UserTable
              users={usersList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onRowClick={handleRowClick}
            />

            {/* PHÂN TRANG */}
            {pageData && (
              <UserPagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={page}
                onPageChange={setPage}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODALS & DRAWERS */}
      <UserForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={selectedUser}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
