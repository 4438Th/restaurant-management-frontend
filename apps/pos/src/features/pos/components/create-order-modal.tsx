// apps/pos/src/features/pos/components/create-order-modal.tsx
import { useState } from "react";
import { toast } from "sonner";
import {
  type TableResponse,
  TableStatus,
  TableStatusLabel,
  TableAreaLabel,
} from "@repo/shared-features/tables";

export interface CreateOrderFormData {
  tableId: string;
  customerName?: string;
  customerPhone?: string;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  tables: TableResponse[];
  isTablesLoading?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderFormData) => void;
}

export function CreateOrderModal({
  isOpen,
  tables = [],
  isTablesLoading = false,
  isLoading = false,
  onClose,
  onSubmit,
}: CreateOrderModalProps) {
  const [tableId, setTableId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  if (!isOpen) return null;

  // Lọc lấy các bàn khả dụng (bỏ bàn đã bị xóa hoặc đang bảo trì)
  const availableTables = tables.filter(
    (tbl) =>
      tbl.status !== TableStatus.DELETED &&
      tbl.status !== TableStatus.MAINTENANCE,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId) {
      toast.error("Vui lòng chọn bàn phục vụ!");
      return;
    }

    onSubmit({
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
          {/* Select Chọn Bàn */}
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
              {availableTables.map((tbl) => {
                const areaName = TableAreaLabel[tbl.area] || tbl.area;
                const statusName = TableStatusLabel[tbl.status] || tbl.status;
                const isOccupied = tbl.status === TableStatus.OCCUPIED;

                return (
                  <option
                    key={tbl.id}
                    value={tbl.id}
                    className={isOccupied ? "text-amber-600 font-semibold" : ""}
                  >
                    {tbl.tableName} - {areaName} ({statusName} - {tbl.capacity}{" "}
                    chỗ)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Tên Khách Hàng */}
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

          {/* Số Điện Thoại */}
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

          {/* Nút Thao Tác */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-variant rounded-xl transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !tableId}
              className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition disabled:opacity-40"
            >
              {isLoading ? "Đang gửi..." : "Xác nhận & Gửi bếp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
