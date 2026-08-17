import React from "react";
import { DishStatus, type DishResponse } from "@repo/shared-features/menu";

export interface DishCardProps {
  dish: DishResponse;
  onAddToCart?: (dish: DishResponse) => void;
  className?: string;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onAddToCart,
  className = "",
}) => {
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(parseFloat(dish.price) || 0);

  const isAvailable = dish.status === DishStatus.AVAILABLE;

  return (
    <div
      onClick={() => isAvailable && onAddToCart?.(dish)}
      className={`
        group relative flex flex-col justify-between p-3 rounded-2xl border border-outline-variant/60 
        bg-surface hover:bg-surface-container-low transition-all duration-200 cursor-pointer select-none
        hover:shadow-md hover:-translate-y-0.5
        ${!isAvailable ? "opacity-50 pointer-events-none bg-surface-container-raw" : ""}
        ${className}
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-surface-container-high mb-3">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.dishName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-xs font-semibold">
            Không có ảnh
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold uppercase">
            Hết món
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between gap-1">
        <h4 className="font-bold text-on-surface text-sm line-clamp-2 leading-snug">
          {dish.dishName}
        </h4>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
          <span className="font-extrabold text-primary text-sm">
            {priceFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};
