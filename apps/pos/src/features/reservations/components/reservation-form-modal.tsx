import { Icon } from "@repo/ui";
import {
  type TableResponse,
  TableStatus,
  TableAreaLabel,
} from "@repo/shared-features/tables";
import type { ReservationFormData } from "@/features/reservations";
import {
  FormRow,
  InputField,
  SelectField,
  TextareaField,
} from "./reservation-form-fields";

interface ReservationFormModalProps {
  isOpen: boolean;
  tables: TableResponse[];
  isEditMode: boolean;
  isSubmitting: boolean;
  formData: ReservationFormData;
  onChange: (field: keyof ReservationFormData, value: string | number) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReservationFormModal({
  isOpen,
  tables,
  isEditMode,
  isSubmitting,
  formData,
  onChange,
  onClose,
  onSubmit,
}: ReservationFormModalProps) {
  if (!isOpen) return null;

  // Lọc bỏ bàn đã xóa hoặc đang bảo trì
  const availableTables = tables.filter(
    (tbl: TableResponse) =>
      tbl.status !== TableStatus.DELETED &&
      tbl.status !== TableStatus.MAINTENANCE,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant w-full max-w-lg shadow-xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50">
          <h3 className="text-lg font-semibold text-on-surface">
            {isEditMode ? "Cập nhật lịch đặt bàn" : "Tạo lịch đặt bàn mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
          <SelectField
            label="Chọn Bàn ăn"
            required
            value={formData.tableId}
            onChange={(e) => onChange("tableId", e.target.value)}
          >
            <option value="" disabled>
              -- Chọn bàn --
            </option>
            {availableTables.map((table: TableResponse) => {
              const areaName = TableAreaLabel[table.area] || table.area;

              return (
                <option key={table.id} value={table.id}>
                  {table.tableName} - {areaName} ({table.capacity} chỗ)
                </option>
              );
            })}
          </SelectField>

          <FormRow>
            <InputField
              label="Tên khách hàng"
              required
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.customerName}
              onChange={(e) => onChange("customerName", e.target.value)}
            />
            <InputField
              label="Số điện thoại"
              required
              type="tel"
              placeholder="0901234567"
              value={formData.customerPhone}
              onChange={(e) => onChange("customerPhone", e.target.value)}
            />
          </FormRow>

          <FormRow>
            <InputField
              label="Số lượng khách"
              required
              type="number"
              min={1}
              value={formData.guestCount}
              onChange={(e) => onChange("guestCount", Number(e.target.value))}
            />
            <InputField
              label="Thời gian đến"
              required
              type="datetime-local"
              value={formData.reservationTime}
              onChange={(e) => onChange("reservationTime", e.target.value)}
            />
          </FormRow>

          <TextareaField
            label="Ghi chú thêm"
            placeholder="Yêu cầu ghế trẻ em, trang trí tiệc..."
            value={formData.note || ""}
            onChange={(e) => onChange("note", e.target.value)}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant text-sm font-medium rounded-xl hover:bg-surface-container"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : isEditMode
                  ? "Cập nhật"
                  : "Tạo lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
