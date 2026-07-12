import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { dishesService } from '../services/dishes.service';
import { DishCreateRequest, DishUpdateRequest } from '../menu.types';


export const useDish = (page: number, size: number, search?: string, status?: string, type?: string, categoryId?: string) => {
    return useQuery({
        queryKey: ['menu/dishes', { page, size, search, status, type, categoryId }],
        queryFn: () => dishesService.getAll(page, size, search, status, type, categoryId),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, DishCreateRequest>({
        mutationFn: (payload: DishCreateRequest) => dishesService.create(payload),
        onSuccess: () => {
            toast.success('Tạo thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Tạo thất bại!');
        },
    });
};

export const useUpdateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: DishUpdateRequest }>({
        mutationFn: ({ id, payload }) => dishesService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Cập nhật thất bại!');
        },
    });
};

export const useDeleteDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => dishesService.delete(id),
        onSuccess: () => {
            toast.success('Đã xóa thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'], exact: false });
            queryClient.invalidateQueries({ queryKey: ["menu/dishes/trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu/dishes"] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa thất bại!');
        },
    });
};
export const useDishTrash = (page: number, size: number, search?: string) => {
    return useQuery({
        queryKey: ['menu/dishes/trash', { page, size, search }],
        queryFn: () => dishesService.getTrash(page, size, search),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useRestoreDish = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => dishesService.restore(id),
        onSuccess: () => {
            toast.success("Đã khôi phục thành công!");
            queryClient.invalidateQueries({ queryKey: ["menu/dishes/trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu/dishes"] });
        }
    });
};
export const useDishAnalytics = () => {
    return useQuery({
        queryKey: ['menu/dishes/analytics'],
        queryFn: () => dishesService.getAnalytics(),
        staleTime: 30 * 1000,
    });
};
