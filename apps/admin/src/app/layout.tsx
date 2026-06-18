import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hệ thống quản trị",
  description: "Phân hệ quản trị",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>{children}</body>
    </html>
  );
}
