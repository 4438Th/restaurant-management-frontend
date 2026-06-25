"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ApiError } from "@repo/core";
import { Icon } from "@/components/ui/icon";
import { useCreateUser, useUpdateUser } from "../users.hooks";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import {
  User,
  AVAILABLE_ROLES,
  UserUpdateRequest,
  UserCreateRequest,
  UserStatus,
} from "../users.types";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserForm({ isOpen, onClose, user }: UserFormProps) {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!user;
  const isEditingAdmin = user?.roles?.includes("ADMIN");

  // State quản lý thông tin form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<UserStatus>(UserStatus.PENDING);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(""); // Lưu trữ dưới dạng "yyyy-MM-dd"

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setDob(user.dob || "");
      setStatus(user.status || UserStatus.PENDING);
      setSelectedRoles(user.roles || []);
      setPassword("");
    } else {
      setUsername("");
      setPassword("");
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDob("");
      setStatus(UserStatus.PENDING);
      setSelectedRoles([]);
    }
  }, [user, isOpen]);

  const dateValue = useMemo(() => {
    if (!dob || !dob.includes("-")) return null;

    const parts = dob.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;

    const [year, month, day] = parts as [number, number, number];
    return new Date(year, month - 1, day);
  }, [dob]);

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setDob("");
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setDob(`${year}-${month}-${day}`);
  };

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username && !isEditMode) return;
    if (!fullName || !email || !phoneNumber || !dob) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (!isEditMode && selectedRoles.length === 0) {
      toast.error("Vui lòng gán ít nhất một vai trò cho nhân sự!");
      return;
    }

    if (isEditMode && user) {
      const payload: UserUpdateRequest = {
        fullName,
        email,
        phoneNumber,
        dob,
        status: isEditingAdmin ? user.status : status,
        roles: selectedRoles,
        password: password.trim() ? password : "",
      };

      updateUserMutation.mutate(
        { id: user.id, payload },
        {
          onSuccess: () => onClose(),
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể cập nhật tài khoản!");
          },
        },
      );
    } else {
      if (!password) return;

      const payload: UserCreateRequest = {
        username,
        password,
        fullName,
        email,
        phoneNumber,
        dob,
        roles: selectedRoles,
      };

      createUserMutation.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (error: ApiError) => {
          toast.error(error.message || "Không thể tạo tài khoản mới!");
        },
      });
    }
  };

  if (!isOpen) return null;

  const isPending =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <>
      {/* Backdrop */}
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
                ? `Tài khoản: ${user?.username}`
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
          {/* Họ và tên */}
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
              required={!isEditMode}
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ví dụ: 0123456789"
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ví dụ: nhanvien@gmail.com"
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Ngày sinh
            </label>
            <div className="relative custom-datepicker-wrapper">
              <DatePicker
                selected={dateValue}
                onChange={handleDateChange}
                locale={vi}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày sinh (dd/MM/yyyy)"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={70}
                required
                className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60">
                <Icon name="Calendar" className="w-4 h-4" />
              </div>
            </div>
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

          {/* Trạng thái */}
          {isEditMode && !isEditingAdmin && (
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">
                Trạng thái tài khoản
              </label>
              <div className="flex gap-2 mt-2">
                {/* 🌟 CHỈ HIỂN THỊ NÚT NÀY nếu trạng thái hiện tại của user đang là PENDING */}
                {status === UserStatus.PENDING && (
                  <button
                    type="button"
                    onClick={() => setStatus(UserStatus.PENDING)}
                    className="flex-1 py-2 px-3 text-[12px] font-bold border rounded-xl transition-all flex items-center justify-center gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Chờ kích hoạt
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStatus(UserStatus.ACTIVE)}
                  className={`flex-1 py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    status === UserStatus.ACTIVE
                      ? "bg-success/10 text-green-600 font-bold border-green-500"
                      : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${status === UserStatus.ACTIVE ? "bg-green-600" : "bg-neutral-400"}`}
                  />
                  Hoạt động
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(UserStatus.INACTIVE)}
                  className={`flex-1 py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    status === UserStatus.INACTIVE
                      ? "bg-error/10 border-error text-error font-bold"
                      : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${status === UserStatus.INACTIVE ? "bg-error" : "bg-neutral-400"}`}
                  />
                  Khóa
                </button>
              </div>
            </div>
          )}

          {/* Phân quyền vai trò  */}
          {(!isEditMode || !isEditingAdmin) && (
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
