import React from "react";
import { Icon } from "@repo/ui";
import type { DishResponse } from "@repo/shared-features/menu";
import { MenuGrid } from "@/features/menu/components/menu-grid";
import type { PreOrderItem } from "../../types";
import { PreOrderCart } from "../pre-order-cart";

interface ReservationMenuStepProps {
  dishes: DishResponse[];
  preOrderItems: PreOrderItem[];
  isSubmitting: boolean;
  onAddToCart: (dish: DishResponse) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

export const ReservationMenuStep: React.FC<ReservationMenuStepProps> = ({
  dishes,
  preOrderItems,
  isSubmitting,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onPrevStep,
  onSubmit,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 mt-4">
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="col-span-8 overflow-y-auto pr-2">
          <MenuGrid dishes={dishes} onAddToCart={onAddToCart} />
        </div>

        <div className="col-span-4 h-full">
          <PreOrderCart
            items={preOrderItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/50 shrink-0 mt-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-4 py-2 border border-outline-variant text-sm font-medium rounded-xl hover:bg-surface-container transition flex items-center gap-1.5"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="px-5 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl disabled:opacity-50 transition flex items-center gap-2"
        >
          <Icon name="Check" className="w-4 h-4" />
          <span>{isSubmitting ? "Đang xử lý..." : "Hoàn tất"}</span>
        </button>
      </div>
    </div>
  );
};
