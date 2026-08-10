"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { setupHttpInterceptor, tokenStorage } from "@repo/core";
import { ConfirmModal } from "@repo/ui";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // State điều khiển hiển thị Modal hết hạn phiên làm việc
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60_000,
          },
        },
      }),
  );

  useEffect(() => {
    // Xử lý Global Interceptor khi Refresh Token thất bại hoàn toàn (Lỗi 401)
    setupHttpInterceptor(() => {
      // 1. Xóa token và dọn dẹp Query Cache
      tokenStorage.clearToken();
      client.clear();

      // 2. Mở Modal thông báo yêu cầu đăng nhập lại
      setIsSessionExpired(true);
    });
  }, [client]);

  // Xử lý sự kiện khi người dùng chủ động bấm xác nhận trên Modal
  const handleConfirmLogin = () => {
    setIsSessionExpired(false);
    window.location.href = "/login";
  };

  return (
    <QueryClientProvider client={client}>
      {children}

      {/* Modal thông báo phiên đăng nhập hết hạn */}
      <ConfirmModal
        isOpen={isSessionExpired}
        onClose={handleConfirmLogin}
        onConfirm={handleConfirmLogin}
        title="Phiên đăng nhập đã hết hạn"
        description="Để bảo mật thông tin, phiên làm việc của bạn đã kết thúc."
        message="Vui lòng đăng nhập lại để tiếp tục thao tác trên hệ thống."
        confirmText="Đăng nhập lại"
        variant="primary"
      />
    </QueryClientProvider>
  );
}
