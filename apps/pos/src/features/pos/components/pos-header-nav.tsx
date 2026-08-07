export interface OpenOrder {
  id: string;
  tableName?: string;
  orderCode?: string;
  itemCount: number;
}

export interface PosHeaderNavProps {
  /** Danh sách các đơn hàng đang mở/phục vụ */
  openOrders?: OpenOrder[];
  /** ID của đơn hàng đang chọn xử lý */
  activeOrderId?: string;
  /** Callbacks thao tác với Order Tabs */
  onSelectOrder?: (orderId: string) => void;
  /** Callback kích hoạt mở Modal chọn bàn & tạo đơn mới */
  onNewOrder?: () => void;
  onCloseOrder?: (orderId: string) => void;

  /** Ô tìm kiếm món ăn */
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PosHeaderNav({
  openOrders = [],
  activeOrderId,
  onSelectOrder,
  onNewOrder,
  onCloseOrder,
  searchQuery,
  onSearchChange,
}: PosHeaderNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/50 shrink-0">
      {/* 1. DANH SÁCH TAB ĐƠN HÀNG ĐANG MỞ */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 max-w-2xl">
        {openOrders.map((order) => {
          const isActive = order.id === activeOrderId;
          return (
            <div
              key={order.id}
              onClick={() => onSelectOrder?.(order.id)}
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
              {openOrders.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseOrder?.(order.id);
                  }}
                  className="p-0.5 rounded-full hover:bg-black/10 transition"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {/* Nút Tạo đơn mới (Kích hoạt Modal) */}
        <button
          type="button"
          onClick={onNewOrder}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-primary text-primary hover:bg-primary/10 text-xs font-bold transition shrink-0"
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-1.5 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
