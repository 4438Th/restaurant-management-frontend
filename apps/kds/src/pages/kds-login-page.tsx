import { useLogin } from "@repo/shared-features";
import { LoginForm, type LoginFormValues } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function KdsLoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = (values: LoginFormValues) => {
    if (!values.username || !values.password) return;

    loginMutation.mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: (data) => {
          // Kiểm tra xem backend trả về token (accessToken hoặc token)
          const token = data?.token;

          if (token) {
            // Lưu token vào localStorage (hoặc cookie) nếu chưa xử lý ở level service
            localStorage.setItem("accessToken", token);

            toast.success("Đăng nhập KDS thành công!");
            // navigate("/KDS", { replace: true });
          } else {
            toast.error("Dữ liệu phản hồi từ máy chủ không hợp lệ!");
          }
        },
        onError: (error) => {
          toast.error(
            error.message ||
              "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-lg">
        {/* LOGO & TITLE PANEL FOR KDS */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider">
            Kitchen Display System
          </div>
          <h1 className="text-[28px] font-black text-primary tracking-tight">
            HTH KDS
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Đăng nhập KDS
          </p>
        </div>

        {/* PURE UI LOGIN FORM */}
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={loginMutation.isPending}
        />
      </div>
    </div>
  );
}
