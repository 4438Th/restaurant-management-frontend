"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { setupHttpInterceptor, tokenStorage } from "@repo/core";
import { toast } from "sonner";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useState(() => {
    if (typeof window !== "undefined") {
      setupHttpInterceptor(() => {
        if (tokenStorage?.clearToken) {
          tokenStorage.clearToken();
        } else {
          localStorage.removeItem("access_token");
        }

        toast.error("Phiên đăng nhập đã hết hạn", {
          description: "Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.",
          duration: 5000,
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      });
    }
  });

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

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
