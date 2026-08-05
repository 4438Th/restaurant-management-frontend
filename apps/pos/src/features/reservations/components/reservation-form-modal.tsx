import { useState } from "react";
import { Icon } from "@repo/ui";
import type {
  TableReservationResponse,
  TableReservationCreateRequest,
  TableReservationUpdateRequest,
} from "@repo/shared-features/reservations";
import type { TableResponse } from "@repo/shared-features/tables";

import {
  FormRow,
  InputField,
  SelectField,
  TextareaField,
} from "./reservation-form-fields";

// ==========================================
// HELPER FUNCTIONS (XỬ LÝ THỜI GIAN LOCALDATETIME)
// ==========================================
function formatIsoToLocalInput(isoString?: string): string {
  if (!isoString) {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
  return isoString.slice(0, 16);
}

function formatLocalInputToLocalDateTime(localDateTimeString: string): string {
  if (localDateTimeString.length === 16) {
    return `${localDateTimeString}:00`;
  }
  return localDateTimeString;
}

// ==========================================
// TYPES & INTERFACES
// ==========================================
export type ReservationFormData = {
  tableId: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  reservationTime: string;
  note?: string;
};

interface ReservationFormModalProps {
  isOpen: boolean;
  tables: TableResponse[];
  initialData?: TableReservationResponse | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: TableReservationCreateRequest | TableReservationUpdateRequest,
  ) => void;
}

// ==========================================
// MAIN MODAL COMPONENT
// ==========================================
export function ReservationFormModal({
  isOpen,
  tables,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: ReservationFormModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>(() => {
    if (initialData) {
      return {
        tableId: initialData.tableId || "",
        customerName: initialData.customerName || "",
        customerPhone: initialData.customerPhone || "",
        guestCount: initialData.guestCount ?? 1,
        reservationTime: formatIsoToLocalInput(initialData.reservationTime),
        note: initialData.note || "",
      };
    }

    return {
      tableId: tables[0]?.id || "",
      customerName: "",
      customerPhone: "",
      guestCount: 2,
      reservationTime: formatIsoToLocalInput(),
      note: "",
    };
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.tableId ||
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.reservationTime
    ) {
      return;
    }

    const payloadTime = formatLocalInputToLocalDateTime(
      formData.reservationTime,
    );

    if (initialData) {
      const updatePayload: TableReservationUpdateRequest = {
        tableId: formData.tableId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        guestCount: formData.guestCount,
        reservationTime: payloadTime,
        note: formData.note || undefined,
      };
      onSubmit(updatePayload);
    } else {
      const createPayload: TableReservationCreateRequest = {
        tableId: formData.tableId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        guestCount: formData.guestCount,
        reservationTime: payloadTime,
        note: formData.note || undefined,
      };
      onSubmit(createPayload);
    }
  };

  const isEditMode = Boolean(initialData);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <SelectField
            label="Chọn Bàn ăn"
            required
            value={formData.tableId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tableId: e.target.value }))
            }
          >
            <option value="" disabled>
              -- Chọn bàn --
            </option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.tableName} ({table.capacity} chỗ)
              </option>
            ))}
          </SelectField>

          <FormRow>
            <InputField
              label="Tên khách hàng"
              required
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
            />
            <InputField
              label="Số điện thoại"
              required
              type="tel"
              placeholder="0901234567"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerPhone: e.target.value,
                }))
              }
            />
          </FormRow>

          <FormRow>
            <InputField
              label="Số lượng khách"
              required
              type="number"
              min={1}
              value={formData.guestCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  guestCount: Number(e.target.value),
                }))
              }
            />
            <InputField
              label="Thời gian đến"
              required
              type="datetime-local"
              value={formData.reservationTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservationTime: e.target.value,
                }))
              }
            />
          </FormRow>

          <TextareaField
            label="Ghi chú thêm"
            placeholder="Yêu cầu ghế trẻ em, trang trí tiệc..."
            value={formData.note || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
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
