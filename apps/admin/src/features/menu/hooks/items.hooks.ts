// apps/admin/src/features/users/users.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { itemsService } from '../services/items.service';
import { MenuItemCreateRequest, MenuItemUpdateRequest } from '../menu.types';


export const useMenuItems = (page: number, size: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['menu-items', { page, size, search, status }],
        queryFn: () => itemsService.getAll(page, size, search, status),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateMenuItems = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, MenuItemCreateRequest>({
        mutationFn: (payload: MenuItemCreateRequest) => itemsService.create(payload),
        onSuccess: () => {
            toast.success('Tạo thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-items'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Tạo thất bại!');
        },
    });
};

export const useUpdateMenuItems = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: MenuItemUpdateRequest }>({
        mutationFn: ({ id, payload }) => itemsService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-items'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Cập nhật thất bại!');
        },
    });
};

export const useDeleteMenuItems = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => itemsService.delete(id),
        onSuccess: () => {
            toast.success('Đã xóa thành công!');
            queryClient.invalidateQueries({ queryKey: ['menu-items'], exact: false });
            queryClient.invalidateQueries({ queryKey: ["menu-items-trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu-items"] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa thất bại!');
        },
    });
};
export const useUsersMenuItems = (page: number, size: number, search?: string) => {
    return useQuery({
        queryKey: ['menu-items-trash', { page, size, search }],
        queryFn: () => itemsService.getTrash(page, size, search),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useRestoreMenuItems = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => itemsService.restore(id),
        onSuccess: () => {
            toast.success("Đã khôi phục thành công!");
            queryClient.invalidateQueries({ queryKey: ["menu-items-trash"] });
            queryClient.invalidateQueries({ queryKey: ["menu-items"] });
        }
    });
};
