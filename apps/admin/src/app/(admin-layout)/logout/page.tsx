"use client";

import { useEffect, useRef } from "react";
import { useLogout } from "@/features/auth/auth.hooks";

export default function LogoutPage() {
  const { mutate: executeLogout } = useLogout();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    executeLogout();
  }, [executeLogout]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[14px] text-on-surface-variant font-medium animate-pulse">
        Đang xử lý đăng xuất...
      </p>
    </div>
  );
}
