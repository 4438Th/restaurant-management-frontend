import { usePosStore } from "@/stores";
import { useSession } from "../hooks";

export function PosHeaderNav() {
  // Lấy state & handlers quản lý phiên/tab đơn hàng từ useSession
  const {
    openOrders,
    activeTabId,
    handleSelectTab,
    handleCloseTab,
    handleOpenCreateModal,
  } = useSession();

  // Lấy state tìm kiếm món ăn trực tiếp từ POS Store
  const searchQuery = usePosStore((state) => state.searchQuery);
  const setSearchQuery = usePosStore((state) => state.setSearchQuery);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/50 shrink-0">
      {/* 1. DANH SÁCH TAB ĐƠN HÀNG ĐANG MỞ */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-2xl">
        {openOrders.map((order) => {
          const isActive = order.id === activeTabId;
          return (
            <div
              key={order.id}
              onClick={() => handleSelectTab(order.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition shrink-0 ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span>{order.tableName || order.orderCode || "Đơn hàng"}</span>
              {order.itemCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-md ${
                    isActive
                      ? "bg-on-primary/20 text-on-primary"
                      : "bg-surface-container-highest text-on-surface-variant"
                  }`}
                >
                  {order.itemCount} món
                </span>
              )}

              {/* Cho phép đóng bất kỳ tab nào */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(order.id);
                }}
                className="p-0.5 rounded-full hover:bg-black/10 transition"
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* Nút Tạo đơn mới -> Trigger bật Modal */}
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-primary text-primary hover:bg-primary/10 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <span>+ Tạo đơn</span>
        </button>
      </div>

      {/* 2. Ô TÌM KIẾM MÓN ĂN */}
      <div className="w-64">
        <input
          type="text"
          placeholder="Tìm món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-1.5 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
