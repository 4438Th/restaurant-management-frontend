import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { usersService } from './users.service';
import { UserCreateRequest, UserUpdateRequest, UserFilterParams } from './users.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params?: UserFilterParams) => [...userKeys.lists(), params] as const,
    trash: () => [...userKeys.all, 'trash'] as const,
    trashList: (params?: UserFilterParams) => [...userKeys.trash(), params] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hằng số hỗ trợ tương thích ngược
export const USERS_QUERY_KEY = userKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const useUsers = (params?: UserFilterParams) => {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => usersService.getAll(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useUsersTrash = (params?: UserFilterParams) => {
    return useQuery({
        queryKey: userKeys.trashList(params),
        queryFn: () => usersService.getTrash(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, UserCreateRequest>({
        mutationFn: (payload: UserCreateRequest) => usersService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: UserUpdateRequest }>({
        mutationFn: ({ id, payload }) => usersService.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => usersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};

export const useRestoreUser = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => usersService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};