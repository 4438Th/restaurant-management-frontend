import { Routes, Route, Navigate } from "react-router-dom";
import {
  //  KdsPage,
  KdsLoginPage,
} from "@/pages";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Route mặc định điều hướng về /pos */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Các trang chức năng */}
      <Route path="/login" element={<KdsLoginPage />} />

      {/* <Route path="/kds" element={<PosPage />} /> */}

      {/* Fallback cho các đường dẫn không tồn tại */}
      <Route path="*" element={<Navigate to="/pos" replace />} />
    </Routes>
  );
};
