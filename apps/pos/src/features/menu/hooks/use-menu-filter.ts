import { useMemo } from "react";
import type { DishResponse } from "@repo/shared-features/menu";
import { usePosStore } from "@/stores";
import { useMenu } from "./use-menu";

export function useMenuFilter() {
    const { categories, dishes, isLoading, isFetching } = useMenu({
        size: 100, // Đảm bảo lấy đủ món ăn cho màn hình POS
    });

    const selectedCategoryId = usePosStore((state) => state.selectedCategoryId);
    const setSelectedCategoryId = usePosStore((state) => state.setSelectedCategoryId);
    const searchQuery = usePosStore((state) => state.searchQuery);
    const setSearchQuery = usePosStore((state) => state.setSearchQuery);

    const filteredDishes = useMemo(() => {
        return dishes.filter((dish: DishResponse) => {
            const matchCategory =
                selectedCategoryId === "ALL" || dish.category?.id === selectedCategoryId;
            const matchSearch =
                !searchQuery ||
                dish.dishName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [dishes, selectedCategoryId, searchQuery]);

    return {
        categories,
        filteredDishes,
        isLoading: isLoading || isFetching,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
    };
}