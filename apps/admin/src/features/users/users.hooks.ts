// apps/admin/src/features/users/users.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { usersService } from './users.service';
import { UserCreateRequest, UserUpdateRequest } from './users.types';


export const useUsers = (page: number, size: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['users', { page, size, search, status }],
        queryFn: () => usersService.getAll(page, size, search, status),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, UserCreateRequest>({
        mutationFn: (payload: UserCreateRequest) => usersService.create(payload),
        onSuccess: () => {
            toast.success('Thêm người dùng mới thành công!');
            queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Thêm người dùng thất bại!');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: UserUpdateRequest }>({
        mutationFn: ({ id, payload }) => usersService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật thông tin thành công!');
            queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Cập nhật thất bại!');
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => usersService.delete(id),
        onSuccess: () => {
            toast.success('Đã xóa người dùng thành công!');
            queryClient.invalidateQueries({ queryKey: ['users'], exact: false });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa người dùng thất bại!');
        },
    });
};