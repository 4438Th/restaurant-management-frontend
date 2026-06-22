"use client";

import { useEffect } from "react";
import { useLogout } from "@/features/auth/auth.hooks";

export default function LogoutPage() {
  const { mutate: executeLogout } = useLogout();

  useEffect(() => {
    executeLogout();
  }, [executeLogout]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-[14px] text-on-surface-variant font-medium animate-pulse">
        Đang xử lý đăng xuất khỏi hệ thống...
      </p>
    </div>
  );
}
