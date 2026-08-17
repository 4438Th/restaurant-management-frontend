import React from "react";
import { Icon } from "@repo/ui";
import {
  type TableResponse,
  TableStatus,
  TableAreaLabel,
} from "@repo/shared-features/tables";
import type { ReservationFormData } from "../../types";
import {
  FormRow,
  InputField,
  SelectField,
  TextareaField,
} from "../reservation-form-fields";

interface ReservationInfoStepProps {
  tables: TableResponse[];
  formData: ReservationFormData;
  isEditMode: boolean;
  isSubmitting: boolean;
  onChange: (field: keyof ReservationFormData, value: string | number) => void;
  onNextStep: () => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ReservationInfoStep: React.FC<ReservationInfoStepProps> = ({
  tables,
  formData,
  isEditMode,
  isSubmitting,
  onChange,
  onNextStep,
  onClose,
  onSubmit,
}) => {
  const availableTables = tables.filter(
    (tbl: TableResponse) =>
      tbl.status !== TableStatus.DELETED &&
      tbl.status !== TableStatus.MAINTENANCE,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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

      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-outline-variant text-sm font-medium rounded-xl hover:bg-surface-container transition"
        >
          Hủy
        </button>
        <div className="flex gap-2">
          {!isEditMode && (
            <button
              type="button"
              onClick={onNextStep}
              className="px-4 py-2 bg-secondary text-on-secondary text-sm font-semibold rounded-xl hover:bg-secondary/90 transition flex items-center gap-1.5"
            >
              <span>Chọn món đặt trước</span>
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl disabled:opacity-50 transition"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditMode
                ? "Cập nhật"
                : "Hoàn tất"}
          </button>
        </div>
      </div>
    </form>
  );
};
