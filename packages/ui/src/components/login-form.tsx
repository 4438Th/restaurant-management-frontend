"use client";

import React from "react";

export interface LoginFormValues {
  username?: string;
  password?: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export function LoginForm({
  onSubmit,
  isSubmitting = false,
  submitText = "Đăng nhập",
}: LoginFormProps) {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!username || !password) return;
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-[12px] font-bold text-on-surface mb-2">
          Tên đăng nhập
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tài khoản"
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-60"
          required
        />
      </div>

      <div>
        <label className="block text-[12px] font-bold text-on-surface mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-60"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-[14px] transition-colors shadow-sm disabled:opacity-50 mt-2 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xác thực hệ thống..." : submitText}
      </button>
    </form>
  );
}
