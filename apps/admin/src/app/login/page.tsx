// apps/admin/src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { coreAuthService } from "@repo/core";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await coreAuthService.login({ username, password });
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setErrorMsg(apiError?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Hệ Thống Nhà Hàng
          </h2>
          <p className="text-sm text-gray-500">
            Cổng thông tin Quản trị viên (Admin)
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {errorMsg && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tài khoản
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-orange-500 focus:outline-none"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-orange-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-orange-600 p-2.5 font-semibold text-white transition hover:bg-orange-700 disabled:bg-gray-400"
          >
            {isLoading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
