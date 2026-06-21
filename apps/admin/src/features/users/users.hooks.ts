// apps/admin/src/features/users/users.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from './users.service';
import { UserCreateRequest } from './users.types';

export const useUsers = (page: number, size: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['users', page, size, search, status],
        queryFn: () => usersService.getAll(page, size, search, status),
        placeholderData: (previousData) => previousData, // Giữ data cũ khi qua trang mới cho mượt
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserCreateRequest) => usersService.create(payload),
        onSuccess: () => {
            // Refresh lại danh sách khi thêm mới thành công
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => usersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};