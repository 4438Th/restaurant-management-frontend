import { useMemo } from "react";
import {
    useDish,
    useMenuCategory,
    dishKeys,
    menuCategoryKeys,
} from "@repo/shared-features/menu";
import type {
    DishResponse,
    MenuCategoryResponse,
    DishFilterParams,
    MenuCategoryFilterParams,
} from "@repo/shared-features/menu";
import type { OffsetPageResponse } from "@repo/core";

// Re-export keys và hooks từ shared package để duy trì tính nhất quán
export { dishKeys, menuCategoryKeys };
export { useDish, useMenuCategory };

/**
 * Custom Hook tổng hợp danh mục và danh sách món ăn cho POS
 */
export const useMenu = (
    dishParams?: DishFilterParams,
    categoryParams?: MenuCategoryFilterParams
) => {
    const categoryQuery = useMenuCategory(categoryParams);
    const dishQuery = useDish(dishParams);

    // Bóc tách danh mục từ OffsetPageResponse hoặc Mảng
    const categories: MenuCategoryResponse[] = useMemo(() => {
        const raw = categoryQuery.data;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        return (raw as OffsetPageResponse<MenuCategoryResponse>).data ?? [];
    }, [categoryQuery.data]);

    // Bóc tách món ăn từ OffsetPageResponse hoặc Mảng
    const dishes: DishResponse[] = useMemo(() => {
        const raw = dishQuery.data;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        return (raw as OffsetPageResponse<DishResponse>).data ?? [];
    }, [dishQuery.data]);

    return {
        categories,
        dishes,
        isLoading: categoryQuery.isLoading || dishQuery.isLoading,
        isError: categoryQuery.isError || dishQuery.isError,
        categoryQuery,
        dishQuery,
        refetch: () => {
            categoryQuery.refetch();
            dishQuery.refetch();
        },
    };
};