"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@repo/core"; // Đường dẫn import class lỗi tùy kiến trúc monorepo
import { Icon } from "@/components/ui/icon";
import { useCreateUser, useUpdateUser } from "../users.hooks";
import { User, AVAILABLE_ROLES, UserUpdateRequest } from "../users.types";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserForm({ isOpen, onClose, user }: UserFormProps) {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!user;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["USER"]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFullName(user.fullName || "");
      setSelectedRoles(user.roles || ["USER"]);
      setPassword("");
    } else {
      setUsername("");
      setPassword("");
      setFullName("");
      setSelectedRoles(["USER"]);
    }
  }, [user, isOpen]);

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !fullName) return;

    if (isEditMode && user) {
      // 🌟 Xử lý any: Định nghĩa rõ kiểu dữ liệu cho object update payload
      const payload: UserUpdateRequest = {
        fullName,
        password: undefined,
      };
      if (password.trim()) payload.password = password;

      updateUserMutation.mutate(
        { id: user.id, payload },
        {
          onSuccess: () => onClose(),
          // 🌟 Xử lý any: Ép kiểu lỗi chuẩn ApiError và thay alert bằng toast.error
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể cập nhật tài khoản!");
          },
        },
      );
    } else {
      if (!password) return;
      createUserMutation.mutate(
        { username, password, fullName, roles: selectedRoles },
        {
          onSuccess: () => onClose(),
          // 🌟 Xử lý any: Ép kiểu lỗi chuẩn ApiError và thay alert bằng toast.error
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể tạo tài khoản mới!");
          },
        },
      );
    }
  };

  if (!isOpen) return null;

  const isPending =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <>
      {/* Backdrop nền tối */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Panel Form Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-container-lowest border-l border-outline-variant z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <div>
            <h3 className="text-[18px] font-bold text-on-surface">
              {isEditMode ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
            </h3>
            <p className="text-[12px] text-on-surface-variant">
              {isEditMode
                ? `Tài khoản: ${user.username}`
                : "Thêm nhân sự vào hệ thống quản trị nhà hàng"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
        >
          {/* Tên nhân viên */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn Toàn"
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required
            />
          </div>

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Tên đăng nhập (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ví dụ: toan.nv"
              disabled={isEditMode}
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-50 disabled:bg-surface-variant"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              {isEditMode
                ? "Mật khẩu mới (Bỏ trống nếu giữ nguyên)"
                : "Mật khẩu khởi tạo"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditMode ? "••••••••" : "Nhập mật khẩu ban đầu"}
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required={!isEditMode}
            />
          </div>

          {/* Phân quyền Roles */}
          {!isEditMode && (
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">
                Phân quyền vai trò
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      type="button"
                      key={role}
                      onClick={() => handleToggleRole(role)}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-bright text-on-surface-variant border-outline-variant hover:bg-surface-variant"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">
                * Hệ thống tự động ánh xạ quyền (Permissions) dựa trên vai trò
                (Roles) được chọn.
              </p>
            </div>
          )}

          {/* Nút hành động */}
          <div className="mt-auto pt-6 border-t border-outline-variant flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-bright border border-outline-variant hover:bg-surface-variant text-on-surface py-2.5 rounded-xl font-semibold text-[14px] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl font-semibold text-[14px] transition-colors disabled:opacity-50"
            >
              {isPending
                ? "Đang xử lý..."
                : isEditMode
                  ? "Cập nhật"
                  : "Lưu tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
