"use client";

import React, { useState } from "react";
import { useLogin } from "@/features/auth/auth.hooks";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-black text-primary tracking-tight">
            ProOps RMS
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-2">
            Đăng nhập hệ thống quản trị nhà hàng
          </p>
        </div>

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
              className="w-full px-4 py-3 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
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
              className="w-full px-4 py-3 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl font-semibold text-[14px] transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loginMutation.isPending
              ? "Đang xác thực hệ thống..."
              : "Đăng nhập hệ thống"}
          </button>
        </form>
      </div>
    </div>
  );
}
