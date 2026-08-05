import { useNavigate } from "react-router-dom";
import { useLogout } from "@repo/shared-features/auth";
import { Icon } from "@repo/ui";

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar() {
  const navigate = useNavigate();
  const { mutate: executeLogout, isPending } = useLogout();

  const handleLogout = () => {
    executeLogout(undefined, {
      onSettled: () => {
        // Chuyển hướng về trang đăng nhập POS và reset state
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <aside className="flex flex-col h-full w-64 bg-surface-container-lowest border-r border-outline-variant">
      {/* BRAND HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <span className="text-[18px] font-black text-primary tracking-tight truncate">
          HTH POS
        </span>
      </div>

      {/* MENU NAVIGATION */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        <a
          href="#"
          className="flex items-center gap-4 px-4 py-2 rounded-lg bg-primary-container/10 text-primary font-bold border-r-4 border-primary transition-colors"
        >
          <Icon name="Home" className="w-5 h-5 shrink-0" />
          <span className="text-[12px]">Trang chủ</span>
        </a>

        <a
          href="#"
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors font-semibold"
        >
          <Icon name="BarChart2" className="w-5 h-5 shrink-0" />
          <span className="text-[12px]">Báo cáo</span>
        </a>
      </nav>

      {/* FOOTER LOGOUT */}
      <div className="p-2 border-t border-outline-variant">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-4 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            name={isPending ? "Loader2" : "LogOut"}
            className={`w-5 h-5 shrink-0 ${isPending ? "animate-spin text-primary" : ""}`}
          />
          <span className="text-[12px] font-semibold">
            {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
          </span>
        </button>
      </div>
    </aside>
  );
}
