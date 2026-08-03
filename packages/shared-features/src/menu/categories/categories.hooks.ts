// apps/admin/src/features/menu/hooks/categories.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
            toast.success('Tạo danh mục món ăn thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Tạo danh mục thất bại!');
        },
    });
};

export const useUpdateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: MenuCategoryUpdateRequest }>({
        mutationFn: ({ id, payload }) => categoriesService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật danh mục món ăn thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Cập nhật danh mục thất bại!');
        },
    });
};

export const useDeleteMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.delete(id),
        onSuccess: () => {
            toast.success('Đã chuyển danh mục món ăn vào thùng rác!');
            queryClient.invalidateQueries({ queryKey: ['menu/categories'] });
            queryClient.invalidateQueries({ queryKey: ['menu/categories/trash'] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa danh mục thất bại!');
        },
    });
};

export const useRestoreMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.restore(id),
        onSuccess: () => {
            toast.success("Khôi phục danh mục món ăn thành công!");
            queryClient.invalidateQueries({ queryKey: ["menu/categories/trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu/categories"] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Khôi phục danh mục thất bại!');
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