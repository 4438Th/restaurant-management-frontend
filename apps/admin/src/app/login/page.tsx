import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-lg">
        {/* LOGO & TITLE PANEL (Server Rendered) */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-black text-primary tracking-tight">
            HTH RMS
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-2">
            Đăng nhập hệ thống quản trị nhà hàng
          </p>
        </div>

        {/* LOGIN FORM (Client Rendered) */}
        <LoginForm />
      </div>
    </div>
  );
}
