import React from "react";
import type { DishResponse } from "@repo/shared-features/menu";
import { DishCard } from "@/features/menu/components/dish-card";

export interface MenuGridProps {
  dishes: DishResponse[];
  onAddToCart?: (dish: DishResponse) => void;
  isLoading?: boolean;
  className?: string;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  dishes,
  onAddToCart,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-surface-container-high animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant text-sm font-medium">
        Không có món ăn nào
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}
    >
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};
