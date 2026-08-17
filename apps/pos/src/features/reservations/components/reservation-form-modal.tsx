import React from "react";
import { Icon } from "@repo/ui";
import type { TableResponse } from "@repo/shared-features/tables";
import type { DishResponse } from "@repo/shared-features/menu";
import type { ReservationFormData, PreOrderItem } from "../types";
import { ReservationInfoStep } from "./steps/reservation-info-step";
import { ReservationMenuStep } from "./steps/reservation-menu-step";

interface ReservationFormModalProps {
  isOpen: boolean;
  currentStep: 1 | 2;
  tables: TableResponse[];
  dishes: DishResponse[];
  isEditMode: boolean;
  isSubmitting: boolean;
  formData: ReservationFormData;
  preOrderItems: PreOrderItem[];
  onChangeStep: (step: 1 | 2) => void;
  onChangeForm: (
    field: keyof ReservationFormData,
    value: string | number,
  ) => void;
  onAddToCart: (dish: DishResponse) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  isOpen,
  currentStep,
  tables,
  dishes,
  isEditMode,
  isSubmitting,
  formData,
  preOrderItems,
  onChangeStep,
  onChangeForm,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className={`bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant w-full transition-all duration-300 shadow-xl ${
          currentStep === 1 ? "max-w-lg" : "max-w-6xl h-[85vh] flex flex-col"
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-on-surface">
              {isEditMode ? "Cập nhật lịch đặt bàn" : "Tạo lịch đặt bàn mới"}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {currentStep === 1 ? "Thông tin nhận bàn" : "Chọn món đặt trước"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {currentStep === 1 ? (
          <ReservationInfoStep
            tables={tables}
            formData={formData}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            onChange={onChangeForm}
            onNextStep={() => onChangeStep(2)}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        ) : (
          <ReservationMenuStep
            dishes={dishes}
            preOrderItems={preOrderItems}
            isSubmitting={isSubmitting}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onPrevStep={() => onChangeStep(1)}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
};
