import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/core';
import { usersService } from './users.service';
import { UserCreateRequest, UserUpdateRequest, UserFilterParams } from './users.types';

export const useUsers = (params: UserFilterParams) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => usersService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useUsersTrash = (params: UserFilterParams) => {
    return useQuery({
        queryKey: ['users-trash', params],
        queryFn: () => usersService.getTrash(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, UserCreateRequest>({
        mutationFn: (payload: UserCreateRequest) => usersService.create(payload),
        onSuccess: () => {
            toast.success('Tạo người dùng thành công!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Tạo thất bại!');
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: UserUpdateRequest }>({
        mutationFn: ({ id, payload }) => usersService.update(id, payload),
        onSuccess: () => {
            toast.success('Cập nhật người dùng thành công!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
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
            toast.success('Đã chuyển người dùng vào thùng rác!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users-trash'] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Xóa thất bại!');
        },
    });
};

export const useRestoreUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => usersService.restore(id),
        onSuccess: () => {
            toast.success("Khôi phục người dùng thành công!");
            queryClient.invalidateQueries({ queryKey: ["users-trash"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Khôi phục thất bại!');
        },
    });
};