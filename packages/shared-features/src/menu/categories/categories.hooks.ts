import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { categoriesService } from './categories.service';
import {
    MenuCategoryCreateRequest,
    MenuCategoryUpdateRequest,
    MenuCategoryFilterParams
} from './categories.types';

// ĐỒNG BỘ: Chuyển các tham số rời rạc thành object `params: MenuCategoryFilterParams`
export const useMenuCategory = (params: MenuCategoryFilterParams) => {
    return useQuery({
        queryKey: ['menu/categories', params],
        queryFn: () => categoriesService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

// ĐỒNG BỘ: Đồng nhất cấu trúc tham số cho phần dữ liệu thùng rác
export const useMenuCategoryTrash = (params: MenuCategoryFilterParams) => {
    return useQuery({
        queryKey: ['menu/categories/trash', params],
        queryFn: () => categoriesService.getTrash(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, MenuCategoryCreateRequest>({
        mutationFn: (payload: MenuCategoryCreateRequest) => categoriesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
        },
    });
};

export const useUpdateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: MenuCategoryUpdateRequest }>({
        mutationFn: ({ id, payload }) => categoriesService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
        },
    });
};

export const useDeleteMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
            queryClient.invalidateQueries({ queryKey: ['menu/categories/trash'] });
        },
    });
};

export const useRestoreMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/categories/trash'] });
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
        },
    });
};

export const useMenuCategoryAnalytics = () => {
    return useQuery({
        queryKey: ['menu/categories/analytics'],
        queryFn: () => categoriesService.getAnalytics(),
        staleTime: 5 * 60 * 1000,
    });
};