// apps/admin/src/app/(admin-layout)/users/trash/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useUsersTrash } from "@/features/users/users.hooks";
import { UserTrashTable } from "@/features/users/components/user-trash-table";
import { UserProfileModal } from "@/features/users/components/user-profile-modal";
import { User } from "@/features/users/users.types";
import { TablePagination } from "@/components/ui/table-pagination";

export default function UserTrashPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

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

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  return (
    <>
      {/* MAIN BODY APP - Cho phép cuộn độc lập nội dung bên dưới TopBar */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        {/* TIÊU ĐỀ TRANG VÀ NÚT QUAY LẠI */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-error flex items-center gap-3">
              <Icon name="Trash2" className="w-7 h-7" />
              Thùng rác
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1">
              Danh sách nhân sự đã tạm dừng hoạt động. Bạn có thể khôi phục lại
              quyền truy cập.
            </p>
          </div>

          <Link
            href="/users"
            className="flex items-center gap-2 bg-surface-variant hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>Quay lại</span>
          </Link>
        </div>

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
                page={page}
                onPageChange={setPage}
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
