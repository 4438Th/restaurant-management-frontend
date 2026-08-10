import { OrderItemStatus, OrderItemStatusLabel } from "@repo/shared-features";
import { Icon } from "@repo/ui";

interface KdsHeaderNavProps {
  selectedStatus: OrderItemStatus | undefined;
  onSelectStatus: (status: OrderItemStatus | undefined) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function KdsHeaderNav({
  selectedStatus,
  onSelectStatus,
  searchTerm,
  onSearchChange,
}: KdsHeaderNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs shrink-0">
      {/* 1. TRẠNG THÁI LỌC */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectStatus(undefined)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === undefined
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
          }`}
        >
          <Icon name="ChefHat" className="w-4 h-4" />
          <span>Tất cả món</span>
        </button>

        {Object.entries(OrderItemStatusLabel).map(([key, label]) => {
          const isActive = selectedStatus === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectStatus(key as OrderItemStatus)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 2. Ô TÌM KIẾM MÓN ĂN */}
      <div className="w-full md:w-64 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Icon name="Search" className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Tìm tên món, mã đơn..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
