import { Routes, Route, Navigate } from "react-router-dom";
import { PosPage, DashboardPage, PosLoginPage, TablePage } from "@/pages";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Route mặc định điều hướng về /pos */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Các trang chức năng */}
      <Route path="/login" element={<PosLoginPage />} />

      <Route path="/pos" element={<PosPage />} />
      <Route path="/tables" element={<TablePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Fallback cho các đường dẫn không tồn tại */}
      <Route path="*" element={<Navigate to="/pos" replace />} />
    </Routes>
  );
};
