"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { setupHttpInterceptor, tokenStorage } from "@repo/core";
import { ConfirmModal } from "@repo/ui";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // State điều khiển hiển thị Modal hết hạn phiên làm việc
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // Xử lý Global Interceptor khi nhận lỗi 401
    setupHttpInterceptor(() => {
      // 1. Xóa token ngay lập tức để chặn các request tiếp theo
      if (tokenStorage?.clearToken) {
        tokenStorage.clearToken();
      } else {
        localStorage.removeItem("access_token");
      }

      // 2. Mở Modal thông báo thay vì bật Toast & tự redirect
      setIsSessionExpired(true);
    });
  }, []);

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
        onClose={() => {
          handleConfirmLogin();
        }}
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
