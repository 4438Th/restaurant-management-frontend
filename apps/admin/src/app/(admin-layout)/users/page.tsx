"use client";

import React, { useState, useEffect } from "react";
import { TablePagination } from "@/components/ui/table-pagination";
import { UserTable } from "@/features/users/components/user-table";
import { UserToolbar } from "@/features/users/components/user-toolbar";
import { UserForm } from "@/features/users/components/user-form";
import { UserProfileModal } from "@/features/users/components/user-profile-modal";
import { PageHeader } from "@/components/layout/page-header";

import { useUsers } from "@/features/users/users.hooks";
import { User, UserFilterParams } from "@/features/users/users.types";

export default function UserManagementPage() {
  // Trạng thái nhập liệu tìm kiếm tức thời trên UI trước khi debounce
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState<string>("All");

  // Tập trung toàn bộ trạng thái phân trang & bộ lọc vào một Object Type-safe duy nhất
  const [filters, setFilters] = useState<UserFilterParams>({
    page: 1,
    size: 10,
    search: undefined,
    status: undefined,
    role: undefined,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Đồng bộ hóa cơ chế Debounce Search và tích hợp các bộ lọc cứng vào State filters
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        page: 1, // Luôn reset về trang đầu tiên khi thay đổi tiêu chí tìm kiếm/bộ lọc
        size: 10,
        search: searchQuery.trim() || undefined,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        role: selectedRole === "All" ? undefined : selectedRole,
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedStatus, selectedRole]);

  // ✅ ĐỒNG BỘ: Truyền chuẩn xác object filters vào hook React Query
  const { data: pageData, isLoading: isFetchLoading } = useUsers(filters);

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
    <>
      {/* VÙNG CUỘN ĐỘC LẬP CHO NỘI DUNG USER */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT CHUYỂN HƯỚNG TỚI THÙNG RÁC */}
        <PageHeader
          title="Danh sách tài khoản"
          description="Quản lý hồ sơ nhân sự và phân quyền truy cập hệ thống."
          buttonText="Thêm tài khoản"
          onButtonClick={handleCreateClick}
          trashLink="/users/trash"
        />

        {/* CONTAINER CARD BẢO VỆ BẢNG KHÔNG BỊ TRÀN VỠ */}
        <div
          className="flex-1 min-h-0 bg-surface-container-lowest
         border border-outline-variant rounded-2xl flex flex-col
          shadow-sm overflow-hidden"
        >
          <UserToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
            }}
            onRoleChange={(role: string) => {
              setSelectedRole(role);
            }}
            selectedRole={selectedRole}
          />

          {/* Vùng chứa Table: Cho phép scroll ngang bên trong nếu dữ liệu quá dài */}
          <div className="flex-1 overflow-auto min-h-0">
            <UserTable
              users={usersList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onRowClick={handleRowClick}
            />
          </div>

          {/* THANH PHÂN TRANG GẮN ĐÁY BOX */}
          {pageData && (
            <div className="border-t border-outline-variant shrink-0">
              <TablePagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={filters.page || 1}
                onPageChange={(pageOrFn) => {
                  setFilters((prev) => {
                    const nextPage =
                      typeof pageOrFn === "function"
                        ? pageOrFn(prev.page || 1)
                        : pageOrFn;

                    return { ...prev, page: nextPage };
                  });
                }}
                unitLabel="tài khoản"
              />
            </div>
          )}
        </div>
      </main>

      {/* CÁC THÀNH PHẦN MODAL & DRAWERS NẰM NGỒI CHỜ KÍCH HOẠT */}
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
    </>
  );
}
