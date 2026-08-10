import { useState, useEffect, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { setupHttpInterceptor, tokenStorage } from "@repo/core";
import { ConfirmModal } from "@repo/ui";
import { AppRoutes } from "@/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  // State quản lý hiển thị Modal hết hạn phiên làm việc
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // Kích hoạt Interceptor toàn cục lắng nghe lỗi 401 (Unauthorized)
    setupHttpInterceptor(() => {
      // 1. Xóa token ngay lập tức
      if (tokenStorage?.clearToken) {
        tokenStorage.clearToken();
      } else {
        localStorage.removeItem("access_token");
      }

      // 2. Mở Modal thông báo hết hạn phiên
      setIsSessionExpired(true);
    });
  }, []);

  // Chuyển hướng người dùng về trang đăng nhập của POS
  const handleConfirmLogin = () => {
    setIsSessionExpired(false);
    window.location.href = "/login";
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense
          fallback={<div className="p-4 text-center">Đang tải trang...</div>}
        >
          <AppRoutes />
        </Suspense>
      </BrowserRouter>

      {/* Thông báo Toast toàn ứng dụng */}
      <Toaster duration={3500} position="top-right" richColors closeButton />

      {/* Modal thông báo hết hạn phiên làm việc */}
      <ConfirmModal
        isOpen={isSessionExpired}
        onClose={handleConfirmLogin}
        onConfirm={handleConfirmLogin}
        title="Phiên đăng nhập đã hết hạn"
        description="Để bảo mật thông tin, phiên làm việc của bạn đã kết thúc."
        message="Vui lòng đăng nhập lại để tiếp tục thao tác trên hệ thống KDS."
        confirmText="Đăng nhập lại"
        variant="primary"
      />
    </QueryClientProvider>
  );
}
