// apps/admin/src/app/users/page.tsx
"use client";

import React, { useState } from "react";
import { useUsers, useDeleteUser } from "@/features/users/users.hooks";
import { UsersTable } from "@/components/users-table";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");

  const { data: pageData, isLoading, error } = useUsers(page, size, search);
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id, {
      onSuccess: () => alert("Đã chuyển người dùng vào thùng rác thành công!"),
      onError: (err: unknown) => {
        const apiError = err as { message?: string };
        alert(apiError?.message || "Có lỗi xảy ra khi xóa!");
      },
    });
  };

  if (error) {
    const apiError = error as { message?: string };
    return (
      <div className="p-6 text-red-500">
        Lỗi tải dữ liệu: {apiError?.message || "Lỗi không xác định từ server"}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản Lý Nhân Viên
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý và phân quyền tài khoản nhân viên nhà hàng
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="Tìm theo tên, username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">
          Đang tải dữ liệu nhân viên...
        </div>
      ) : (
        <>
          <UsersTable users={pageData?.data || []} onDelete={handleDelete} />

          {pageData && pageData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
              <div className="text-sm text-gray-700">
                Hiển thị trang{" "}
                <span className="font-medium">{pageData.currentPage}</span> /{" "}
                <span className="font-medium">{pageData.totalPages}</span> (
                <span className="font-medium">{pageData.totalElements}</span>{" "}
                nhân viên)
              </div>
              <div className="flex flex-1 justify-end gap-2 sm:justify-none">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  disabled={page >= pageData.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
