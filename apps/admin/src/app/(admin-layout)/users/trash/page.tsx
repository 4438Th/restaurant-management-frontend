"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui";
import { useUsersTrash } from "@repo/shared-features/users";
import { UserTrashTable } from "@/features/users/components";
import { UserProfileModal } from "@/features/users/components";
import { TablePagination } from "@/components/ui";
import { PageHeader } from "@/components/layout";

import { User, UserFilterParams } from "@repo/shared-features/users";

export default function UserTrashPage() {
  // Quản lý trạng thái nhập liệu tìm kiếm tức thời trên UI
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tập trung toàn bộ tham số phân trang & tìm kiếm vào một Object đồng bộ với Back-End
  const [filters, setFilters] = useState<UserFilterParams>({
    page: 1,
    size: 10,
    search: undefined,
  });

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Xử lý cơ chế Debounce khi người dùng nhập từ khóa tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchQuery.trim() || undefined,
        page: 1, // Reset về trang đầu tiên khi có từ khóa tìm kiếm mới
      }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Truyền object filters đồng nhất vào hook
  const { data: pageData, isLoading: isFetchLoading } = useUsersTrash(filters);

  const trashList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <>
      {/* MAIN BODY APP - Cho phép cuộn độc lập nội dung bên dưới TopBar */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI */}
        <PageHeader
          title="Thùng rác"
          description="Danh sách nhân sự đã tạm dừng hoạt động. Bạn có thể khôi phục lại quyền truy cập."
          isTrash={true}
          backLink="/users"
        />

        {/* CONTAINER CARD CHỐNG TRÀN BẢNG */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          {/* Ô TÌM KIẾM NHANH */}
          <div className="p-4 border-b border-outline-variant bg-surface-bright flex gap-4 shrink-0">
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

          {/* VÙNG CHỨA BẢNG: Cuộn nội bộ nếu dữ liệu tràn chiều cao hoặc chiều ngang */}
          <div className="flex-1 overflow-auto min-h-0">
            <UserTrashTable
              users={trashList}
              isLoading={isFetchLoading}
              onRowClick={handleRowClick}
            />
          </div>

          {/* BỘ PHÂN TRANG GẮN CHẶT ĐÁY BOX */}
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

      {/* MODAL CHI TIẾT HỒ SƠ */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </>
  );
}
