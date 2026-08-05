import React from "react";
import type { MenuCategoryResponse } from "@repo/shared-features/menu";

export interface CategoryBarProps {
  categories: MenuCategoryResponse[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onSelectCategory("ALL")}
        className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
          selectedCategoryId === "ALL"
            ? "bg-primary text-on-primary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        Tất cả món
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelectCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
            selectedCategoryId === cat.id
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
};
