"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@repo/ui";
import { ApiError } from "@repo/core";
import { TablePagination } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import {
  UserTable,
  UserToolbar,
  UserForm,
  UserProfileModal,
  UserFormSubmitData,
} from "@/features/users/components";

import {
  User,
  UserFilterParams,
  UserCreateRequest,
  UserUpdateRequest,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@repo/shared-features/users";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  const [filters, setFilters] = useState<UserFilterParams>({
    page: 1,
    size: 10,
    search: undefined,
    status: undefined,
    role: undefined,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State bảo vệ tài khoản cần xóa
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Hooks Mutation
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const isFormPending =
    createUserMutation.isPending || updateUserMutation.isPending;

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev: UserFilterParams) => ({
        ...prev,
        page: 1,
        search: searchQuery.trim() || undefined,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        role: selectedRole === "All" ? undefined : selectedRole,
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedStatus, selectedRole]);

  const { data: pageData, isLoading: isFetchLoading } = useUsers(filters);

  const usersList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  const handleCreateClick = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsProfileOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  // 1. XỬ LÝ SUBMIT TỪ PURE USERFORM
  const handleFormSubmit = ({
    isEditMode,
    userId,
    payload,
  }: UserFormSubmitData) => {
    if (isEditMode && userId) {
      updateUserMutation.mutate(
        { id: userId, payload: payload as UserUpdateRequest },
        {
          onSuccess: () => {
            toast.success("Cập nhật tài khoản thành công!");
            setIsDrawerOpen(false);
          },
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể cập nhật tài khoản!");
          },
        },
      );
    } else {
      createUserMutation.mutate(payload as UserCreateRequest, {
        onSuccess: () => {
          toast.success("Tạo tài khoản mới thành công!");
          setIsDrawerOpen(false);
        },
        onError: (error: ApiError) => {
          toast.error(error.message || "Không thể tạo tài khoản mới!");
        },
      });
    }
  };

  // 2. THỰC THI LỆNH XÓA BẰNG API MUTATION
  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success(
          `Đã chuyển tài khoản "${userToDelete.fullName || userToDelete.username}" vào thùng rác`,
        );
        setUserToDelete(null);
      },
      onError: (error: ApiError) => {
        toast.error(
          error.message ||
            `Có lỗi xảy ra khi xóa tài khoản "${userToDelete.username}"!`,
        );
      },
    });
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        <PageHeader
          title="Danh sách tài khoản"
          description="Quản lý hồ sơ nhân sự và phân quyền truy cập hệ thống."
          buttonText="Thêm tài khoản"
          onButtonClick={handleCreateClick}
          trashLink="/users/trash"
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <UserToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          <div className="flex-1 overflow-auto min-h-0">
            <UserTable
              users={usersList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onRowClick={handleRowClick}
            />
          </div>

          {pageData && (
            <div className="border-t border-outline-variant shrink-0">
              <TablePagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={filters.page || 1}
                onPageChange={(pageOrFn) => {
                  setFilters((prev: UserFilterParams) => ({
                    ...prev,
                    page:
                      typeof pageOrFn === "function"
                        ? pageOrFn(prev.page || 1)
                        : pageOrFn,
                  }));
                }}
                unitLabel="tài khoản"
              />
            </div>
          )}
        </div>
      </main>

      {/* FORM TẠO / SỬA USER (PURE UI) */}
      <UserForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={selectedUser}
        isPending={isFormPending}
        onSubmit={handleFormSubmit}
        onErrorValidation={(msg) => toast.error(msg)}
      />

      {/* MODAL CHI TIẾT USER */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />

      {/* MODAL XÁC NHẬN XÓA TÀI KHOẢN */}
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tài khoản"
        description="Tài khoản này sẽ bị khóa và chuyển vào thùng rác."
        message={
          <>
            Bạn có chắc chắn muốn xóa tài khoản{" "}
            <strong className="text-primary">
              {userToDelete?.fullName || userToDelete?.username}
            </strong>{" "}
            không?
          </>
        }
        confirmText="Xóa tài khoản"
        variant="danger"
        isLoading={deleteUserMutation.isPending}
      />
    </>
  );
}
