// apps/admin/src/features/users/users.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from './users.service';
import { UserCreateRequest, UserStatus } from './users.types';
import type { UserResponse } from './users.types';
import { PageResponse } from '@repo/core';

const MOCK_USERS_POOL: UserResponse[] = [
    {
        id: "USR-0001",
        username: "alex_admin",
        fullName: "Alex Ferguson",
        email: "alex.f@proops.net",
        status: UserStatus.ACTIVE,
        roles: [{ name: "Admin", description: "Full system control" }],
        createdAt: "2026-01-15T08:00:00Z",
        createdBy: "SYSTEM",
        updatedAt: "2026-01-15T08:00:00Z",
        updatedBy: "SYSTEM",
        deletedAt: null,
        deletedBy: null
    },
    {
        id: "USR-0002",
        username: "gordon_chef",
        fullName: "Gordon Ramsay",
        email: "g.ramsay@proops.net",
        status: UserStatus.ACTIVE,
        roles: [{ name: "Chef", description: "Kitchen operations management" }],
        createdAt: "2026-02-01T09:30:00Z",
        createdBy: "USR-0001",
        updatedAt: "2026-02-02T10:00:00Z",
        updatedBy: "USR-0001",
        deletedAt: null,
        deletedBy: null
    },
    {
        id: "USR-0003",
        username: "jess_cashier",
        fullName: "Jessica Alba",
        email: "j.alba@proops.net",
        status: UserStatus.PENDING,
        roles: [{ name: "Cashier", description: "POS sales & checkout counter" }],
        createdAt: "2026-06-20T14:22:00Z",
        createdBy: "USR-0001",
        updatedAt: "2026-06-20T14:22:00Z",
        updatedBy: "USR-0001",
        deletedAt: null,
        deletedBy: null
    },
    {
        id: "USR-0004",
        username: "david_staff",
        fullName: "David Beckham",
        email: "d.beckham@proops.net",
        status: UserStatus.INACTIVE,
        roles: [{ name: "Staff", description: "Front of House operations" }],
        createdAt: "2025-11-12T07:15:00Z",
        createdBy: "USR-0001",
        updatedAt: "2026-03-01T11:00:00Z",
        updatedBy: "USR-0001",
        deletedAt: null,
        deletedBy: null
    },
    {
        id: "USR-0005",
        username: "marcus_mgr",
        fullName: "Marcus Aurelius",
        email: "marcus.m@proops.net",
        status: UserStatus.ACTIVE,
        roles: [{ name: "Manager", description: "Store overall operations" }],
        createdAt: "2026-03-10T10:00:00Z",
        createdBy: "USR-0001",
        updatedAt: "2026-03-10T10:00:00Z",
        updatedBy: "USR-0001",
        deletedAt: null,
        deletedBy: null
    }
];

export const useUsers = (page: number, size: number, search?: string, status?: string) => {
    return useQuery({
        queryKey: ['users', page, size, search, status],
        queryFn: async () => {
            try {
                return await usersService.getAll(page, size, search, status);
            } catch (error) {
                console.warn("Backend offline! Switching to frontend mock pagination data for demo.");

                // Luồng Mock: Tự thực hiện filter & phân trang tại Client để chạy Demo
                let filtered = [...MOCK_USERS_POOL];

                if (search) {
                    filtered = filtered.filter(u =>
                        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        u.username.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (status) {
                    filtered = filtered.filter(u => u.status === status);
                }

                const totalElements = filtered.length;
                const totalPages = Math.ceil(totalElements / size) || 1;
                const startIdx = (page - 1) * size;
                const pagedData = filtered.slice(startIdx, startIdx + size);

                const mockResponse: PageResponse<UserResponse> = {
                    currentPage: page,
                    totalPages: totalPages,
                    pageSize: size,
                    totalElements: totalElements,
                    nextPageUrl: page < totalPages ? `/users?page=${page + 1}` : null,
                    previousPageUrl: page > 1 ? `/users?page=${page - 1}` : null,
                    data: pagedData
                };

                return mockResponse;
            }
        },
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UserCreateRequest) => usersService.create(payload),
        onSuccess: () => {
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