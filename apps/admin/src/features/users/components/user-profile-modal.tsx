"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { User, UserStatus, UserUpdateRequest } from "../users.types";
import { useUpdateUser } from "../users.hooks";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  const updateUserMutation = useUpdateUser();
  if (!isOpen || !user) return null;

  const handleActivate = () => {
    if (confirm(`Xác nhận kích hoạt tài khoản "${user.fullName}"`)) {
      // 🌟 ĐÃ SỬA: Chỉ bóc tách các trường chuẩn theo đúng cấu trúc của UserUpdateRequest
      const payload: UserUpdateRequest = {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        status: UserStatus.ACTIVE, // Cập nhật trạng thái kích hoạt thành ACTIVE
        roles: user.roles || [],
        password: "", // Để trống mật khẩu vì không thay đổi mật khẩu khi kích hoạt
      };

      updateUserMutation.mutate(
        {
          id: user.id,
          payload,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl z-50 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
        {/* Banner trang trí nhỏ */}
        <div className="h-24 bg-linear-to-r from-primary/20 to-primary-container/40 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-surface/80 hover:bg-surface rounded-full text-on-surface-variant transition-colors shadow-sm"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung hồ sơ */}
        <div className="px-6 pb-6 relative flex flex-col gap-5">
          {/* Avatar giả lập dạng chữ cái đầu */}
          <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-[28px] font-black shadow-md border-4 border-surface-container-lowest -mt-10 mb-2 select-none">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          {/* Tiêu đề thông tin chính */}
          <div>
            <h3 className="text-[22px] font-black text-on-surface tracking-tight leading-tight">
              {user.fullName}
            </h3>
            <p className="text-[13px] text-on-surface-variant font-mono mt-0.5">
              @{user.username}
            </p>
          </div>

          <hr className="border-outline-variant" />

          {/* Chi tiết dữ liệu */}
          <div className="flex flex-col gap-4">
            {/* Trạng thái hoạt động */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant font-medium">
                Trạng thái hệ thống:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 ${
                  user.status === UserStatus.INACTIVE
                    ? "bg-error/10 text-error border border-error/20"
                    : user.status === UserStatus.PENDING
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : user.status === UserStatus.DELETED
                        ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                        : "bg-green-600/10 text-green-600 border border-green-600/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    user.status === UserStatus.INACTIVE
                      ? "bg-error"
                      : user.status === UserStatus.PENDING
                        ? "bg-amber-500"
                        : user.status === UserStatus.DELETED
                          ? "bg-slate-500"
                          : "bg-green-600"
                  }`}
                />
                {user.status === UserStatus.INACTIVE
                  ? "Đang bị khóa"
                  : user.status === UserStatus.PENDING
                    ? "Chờ kích hoạt"
                    : user.status === UserStatus.DELETED
                      ? "Đã xóa"
                      : "Đang hoạt động"}
              </span>
            </div>

            {/* 🌟 ĐÃ BỔ SUNG UI: Số điện thoại */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant font-medium">
                Số điện thoại:
              </span>
              <span className="text-on-surface font-semibold">
                {user.phoneNumber || "---"}
              </span>
            </div>

            {/* 🌟 ĐÃ BỔ SUNG UI: Địa chỉ Email */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant font-medium">
                Địa chỉ Email:
              </span>
              <span className="text-on-surface font-semibold">
                {user.email || "---"}
              </span>
            </div>

            {/* 🌟 ĐÃ BỔ SUNG UI: Ngày sinh */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-on-surface-variant font-medium">
                Ngày sinh:
              </span>
              <span className="text-on-surface font-semibold">
                {user.dob || "---"}
              </span>
            </div>

            {/* Danh sách vai trò */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] text-on-surface-variant font-medium">
                Vai trò gán quyền:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-1 bg-secondary-container/20 text-primary border border-outline-variant text-[11px] font-bold rounded-lg"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-[12px] text-on-surface-variant italic">
                    Chưa phân vai trò
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Nút hành động chân trang */}
          <div className="mt-4 pt-4 border-t border-outline-variant flex justify-end gap-2">
            {/* NÚT KÍCH HOẠT: Chỉ hiển thị khi trạng thái là PENDING */}
            {user.status === UserStatus.PENDING && (
              <button
                onClick={handleActivate}
                disabled={updateUserMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {updateUserMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon name="CheckCircle" className="w-4 h-4" />
                )}
                <span>Kích hoạt tài khoản</span>
              </button>
            )}

            <button
              onClick={onClose}
              disabled={updateUserMutation.isPending}
              className="border border-outline-variant hover:bg-surface-container text-on-surface px-5 py-2 rounded-xl text-[13px] font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
