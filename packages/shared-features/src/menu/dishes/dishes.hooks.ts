import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { dishesService } from './dishes.service';
import {
    DishCreateRequest,
    DishUpdateRequest,
    DishFilterParams
} from './dishes.types';

// ĐỒNG BỘ: Chuyển các tham số rời rạc thành object `params`
export const useDish = (params: DishFilterParams) => {
    return useQuery({
        queryKey: ['menu/dishes', params],
        queryFn: () => dishesService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

// ĐỒNG BỘ: Đồng nhất cấu trúc tham số cho phần dữ liệu thùng rác
export const useDishTrash = (params: DishFilterParams) => {
    return useQuery({
        queryKey: ['menu/dishes/trash', params],
        queryFn: () => dishesService.getTrash(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, DishCreateRequest>({
        mutationFn: (payload: DishCreateRequest) => dishesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'] });
        },
    });
};

export const useUpdateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: DishUpdateRequest }>({
        mutationFn: ({ id, payload }) => dishesService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'] });
        },
    });
};

export const useDeleteDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => dishesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'] });
            queryClient.invalidateQueries({ queryKey: ['menu/dishes/trash'] });
        },
    });
};

export const useRestoreDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => dishesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu/dishes/trash'] });
            queryClient.invalidateQueries({ queryKey: ['menu/dishes'] });
        },
    });
};

export const useDishAnalytics = () => {
    return useQuery({
        queryKey: ['menu/dishes/analytics'],
        queryFn: () => dishesService.getAnalytics(),
        staleTime: 30 * 1000,
    });
};