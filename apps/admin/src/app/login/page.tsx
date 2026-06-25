"use client";

import React, { useState, useEffect } from "react";
import { useLogin } from "@/features/auth/auth.hooks";
import { tokenStorage } from "@repo/core";

export default function LoginPage() {
  useEffect(() => {
    tokenStorage.clearToken();
  }, []);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useLogin();

  const isSubmitting = loginMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!username || !password) return;

    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-lg">
        {/* LOGO & TITLE PANEL */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-black text-primary tracking-tight">
            HTH RMS
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-2">
            Đăng nhập hệ thống quản trị nhà hàng
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* USERNAME INPUT */}
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

          {/* PASSWORD INPUT */}
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

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-[14px] transition-colors shadow-sm disabled:opacity-50 mt-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                {/* Loader icon giả lập (nếu có thư viện) hoặc chữ hiển thị */}
                Đang xác thực hệ thống...
              </span>
            ) : (
              "Đăng nhập hệ thống"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
