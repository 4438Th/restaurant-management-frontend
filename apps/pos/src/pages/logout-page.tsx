import { useEffect, useRef } from "react";
import { useLogout } from "@repo/shared-features/auth";
import { useNavigate } from "react-router-dom";

export function PosLogoutPage() {
  const navigate = useNavigate();
  const { mutate: executeLogout } = useLogout();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    executeLogout(undefined, {
      onSuccess: () => {
        // Chuyển hướng về trang đăng nhập của POS
        navigate("/login", { replace: true });
      },
      onError: () => {
        // Vẫn chuyển về /login nếu API lỗi
        navigate("/login", { replace: true });
      },
    });
  }, [executeLogout, navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 select-none">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[14px] text-on-surface-variant font-medium animate-pulse">
        Đang xử lý đăng xuất POS...
      </p>
    </div>
  );
}
