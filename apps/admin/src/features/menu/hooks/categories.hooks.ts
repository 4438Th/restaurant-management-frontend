// apps/admin/src/features/users/users.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { categoriesService } from '../services/categories.service';
import { MenuCategoryCreateRequest, MenuCategoryUpdateRequest } from '../menu.types';


export const useMenuCategory = (page: number, size: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['users', { page, size, search, status }],
        queryFn: () => categoriesService.getAll(page, size, search, status),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, MenuCategoryCreateRequest>({
        mutationFn: (payload: MenuCategoryCreateRequest) => categoriesService.create(payload),
        onSuccess: () => {
            toast.success('Tạo thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-categories'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Tạo thất bại!');
        },
    });
};

export const useUpdateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: MenuCategoryUpdateRequest }>({
        mutationFn: ({ id, payload }) => categoriesService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-categories'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Cập nhật thất bại!');
        },
    });
};

export const useDeleteMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.delete(id),
        onSuccess: () => {
            toast.success('Đã xóa thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-categories'], exact: false });
            queryClient.invalidateQueries({ queryKey: ["menu-categories-trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa thất bại!');
        },
    });
};
export const useUsersMenuCategory = (page: number, size: number, search?: string) => {
    return useQuery({
        queryKey: ['menu-categories-trash', { page, size, search }],
        queryFn: () => categoriesService.getTrash(page, size, search),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useRestoreMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => categoriesService.restore(id),
        onSuccess: () => {
            toast.success("Đã khôi phục thành công!");
            queryClient.invalidateQueries({ queryKey: ["menu-categories-trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
        }
    });
};
