export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col border-r border-outline-variant bg-surface transition-all duration-300 shrink-0 ${
        isCollapsed
          ? "w-(--spacing-sidebar-collapsed)"
          : "w-(--spacing-sidebar-collapsed)"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-(--spacing-custom-md) border-b border-outline-variant">
        {!isCollapsed && (
          <span className="font-bold text-lg text-primary">App Brand</span>
        )}
        <button
          onClick={onToggle}
          type="button"
          aria-label="Toggle Sidebar"
          className="text-on-surface-variant hover:bg-surface-container p-1.5 rounded-full transition mx-auto"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 space-y-1 p-(--spacing-custom-sm) overflow-y-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary-container text-on-primary-container font-medium"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {!isCollapsed && <span>Trang chủ</span>}
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition font-medium"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {!isCollapsed && <span>Báo cáo</span>}
        </a>
      </nav>
    </aside>
  );
}
