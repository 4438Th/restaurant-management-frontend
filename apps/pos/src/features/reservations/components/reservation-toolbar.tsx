import { Icon } from "@repo/ui";
import { TableReservationStatusLabel } from "@repo/shared-features/reservations";

interface ReservationToolbarProps {
  searchQuery: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateNew: () => void;
}

export function ReservationToolbar({
  searchQuery,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onCreateNew,
}: ReservationToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
      <div className="flex flex-wrap items-center gap-3">
        {/* Ô Tìm kiếm */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Tìm tên khách, SĐT, bàn..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
          />
          <Icon
            name="Search"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
        </div>

        {/* Lọc Trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-outline-variant rounded-xl text-sm bg-surface text-on-surface focus:outline-none focus:border-primary font-medium"
        >
          <option value="ALL">Tất cả trạng thái</option>
          {Object.entries(TableReservationStatusLabel).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Nút Tạo mới đặt bàn */}
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
      >
        <Icon name="Plus" className="w-4 h-4" />
        <span>Tạo đặt bàn</span>
      </button>
    </div>
  );
}
