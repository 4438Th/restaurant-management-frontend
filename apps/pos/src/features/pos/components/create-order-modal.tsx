import { useState } from "react";
import { toast } from "sonner";
import {
  type TableResponse,
  TableStatus,
  TableAreaLabel,
} from "@repo/shared-features/tables";

export interface CreateOrderFormData {
  tableId: string;
  customerName?: string;
  customerPhone?: string;
}

export interface CreateOrderModalProps {
  isOpen?: boolean;
  tables?: TableResponse[];
  isTablesLoading?: boolean;
  isLoading?: boolean;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: (data: CreateOrderFormData) => void;
}

/**
 * Hàm hỗ trợ định dạng thời gian đặt bàn tiếp theo thành chuỗi dễ đọc
 */
const formatNextReservationTime = (isoString?: string | null): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Hôm nay lúc ${hours}:${minutes}`;
    }
    return `${hours}:${minutes} ngày ${day}/${month}`;
  } catch {
    return "";
  }
};

export function CreateOrderModal({
  isOpen = false,
  tables = [],
  isTablesLoading = false,
  isLoading = false,
  submitLabel = "Tạo đơn hàng",
  onClose,
  onSubmit,
}: CreateOrderModalProps) {
  const [tableId, setTableId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  if (!isOpen) return null;

  // Chỉ lọc bỏ các bàn đã xóa hoặc đang bảo trì
  const availableTables = tables.filter(
    (tbl: TableResponse) =>
      tbl.status !== TableStatus.DELETED &&
      tbl.status !== TableStatus.MAINTENANCE,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId) {
      toast.error("Vui lòng chọn bàn phục vụ!");
      return;
    }

    onSubmit?.({
      tableId,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-on-surface mb-4">
          Tạo đơn hàng mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Chọn bàn phục vụ <span className="text-error">*</span>
            </label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              disabled={isTablesLoading || isLoading}
              className="w-full px-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-primary text-on-surface disabled:opacity-50"
            >
              <option value="">-- Chọn bàn --</option>
              {availableTables.map((tbl: TableResponse) => {
                const areaName = TableAreaLabel[tbl.area] || tbl.area;
                const isOccupied = tbl.status === TableStatus.OCCUPIED;
                const formattedReservation = formatNextReservationTime(
                  tbl.nextReservationTime,
                );

                return (
                  <option
                    key={tbl.id}
                    value={tbl.id}
                    disabled={isOccupied}
                    className={
                      isOccupied
                        ? "text-outline bg-surface-container/50 italic"
                        : ""
                    }
                  >
                    {tbl.tableName} - {areaName} ({tbl.capacity} chỗ){" "}
                    {isOccupied ? "- [Đang có khách]" : ""}
                    {!isOccupied && formattedReservation
                      ? ` - [Có lịch hẹn lúc ${formattedReservation}]`
                      : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Tên khách hàng (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="Nhập tên khách hàng..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary text-on-surface disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Số điện thoại (Tùy chọn)
            </label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-primary text-on-surface disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-variant rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !tableId}
              className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition disabled:opacity-40 cursor-pointer"
            >
              {isLoading ? "Đang xử lý..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
