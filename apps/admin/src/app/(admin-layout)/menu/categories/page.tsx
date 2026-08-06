"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@repo/core";

import {
  MenuCategoryToolbar,
  MenuCategoryTable,
  MenuCategoryForm,
  MenuCategoryAnalytics,
  MenuCategoryFormValues,
} from "@/features/menu/components";
import { PageHeader } from "@/components/layout";
import { ConfirmModal, TablePagination } from "@repo/ui";

import {
  useMenuCategory,
  useCreateMenuCategory,
  useUpdateMenuCategory,
  useDeleteMenuCategory,
  MenuCategoryResponse,
  MenuCategoryStatus,
  MenuCategoryFilterParams,
} from "@repo/shared-features/menu";

export default function MenuCategoriesPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryResponse | null>(null);

  // State quản lý danh mục chờ xóa
  const [categoryToDelete, setCategoryToDelete] =
    useState<MenuCategoryResponse | null>(null);

  // Custom hooks xử lý API Mutate
  const createMutation = useCreateMenuCategory();
  const updateMutation = useUpdateMenuCategory();
  const deleteMutation = useDeleteMenuCategory();

  // Debounce ô tìm kiếm (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Chuẩn bị filter params cho React Query hook
  const filterParams: MenuCategoryFilterParams = {
    page,
    size,
    search: debouncedSearch.trim() || undefined,
    status:
      selectedStatus === "All"
        ? undefined
        : (selectedStatus as MenuCategoryStatus),
  };

  const { data: pageData, isLoading: isFetchLoading } =
    useMenuCategory(filterParams);

  const categoriesList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  // Handler mở drawer tạo mới
  const handleCreateClick = (): void => {
    setSelectedCategory(null);
    setIsDrawerOpen(true);
  };

  // Handler mở drawer cập nhật
  const handleEditClick = (category: MenuCategoryResponse): void => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  // Mở modal xác nhận xóa
  const handleDeleteClick = (category: MenuCategoryResponse): void => {
    setCategoryToDelete(category);
  };

  // Thực thi API Xóa danh mục khi người dùng xác nhận trên Modal
  const handleConfirmDelete = (): void => {
    if (!categoryToDelete) return;

    deleteMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        toast.success(
          `Xóa danh mục "${categoryToDelete.categoryName}" thành công!`,
        );
        setCategoryToDelete(null);
        if (categoriesList.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      },
      onError: (error: ApiError) => {
        toast.error(error?.message || "Có lỗi xảy ra khi xóa danh mục!");
      },
    });
  };

  // Quản lý submit Form (Tạo / Cập nhật) & hiển thị Toast
  const handleFormSubmit = async (values: MenuCategoryFormValues) => {
    const cleanCategoryName = values.categoryName.trim();
    const cleanDescription = values.description.trim();

    if (selectedCategory) {
      // API Cập nhật
      updateMutation.mutate(
        {
          id: selectedCategory.id,
          payload: {
            categoryName: cleanCategoryName,
            description: cleanDescription,
            status: values.status,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              `Cập nhật danh mục "${cleanCategoryName}" thành công!`,
            );
            setIsDrawerOpen(false);
          },
          onError: (error: ApiError) => {
            toast.error(
              error?.message || "Có lỗi xảy ra khi cập nhật danh mục!",
            );
          },
        },
      );
    } else {
      // API Tạo mới
      createMutation.mutate(
        {
          categoryName: cleanCategoryName,
          description: cleanDescription,
        },
        {
          onSuccess: () => {
            toast.success(`Tạo danh mục "${cleanCategoryName}" thành công!`);
            setIsDrawerOpen(false);
          },
          onError: (error: ApiError) => {
            toast.error(error?.message || "Có lỗi xảy ra khi tạo danh mục!");
          },
        },
      );
    }
  };

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        <PageHeader
          title="Danh mục thực đơn"
          description="Phân loại thực đơn giúp khách hàng và nhân viên dễ dàng tìm kiếm món."
          buttonText="Thêm danh mục"
          onButtonClick={handleCreateClick}
          trashLink="/menu/categories/trash"
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <MenuCategoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
          />

          <div className="flex-1 overflow-auto min-h-0">
            <MenuCategoryTable
              categories={categoriesList}
              isLoading={isFetchLoading}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              deletingCategoryId={
                deleteMutation.isPending
                  ? (deleteMutation.variables as string)
                  : null
              }
            />
          </div>

          {pageData && (
            <div className="border-t border-outline-variant shrink-0">
              <TablePagination
                currentPage={pageData.currentPage}
                totalPages={totalPages}
                totalElements={pageData.totalElements}
                page={page}
                onPageChange={setPage}
                unitLabel="danh mục"
              />
            </div>
          )}
        </div>

        <MenuCategoryAnalytics />
      </main>

      {/* FORM DRAWER */}
      <MenuCategoryForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        category={selectedCategory}
        onSubmit={handleFormSubmit}
        isPending={isFormPending}
      />

      {/* MODAL XÁC NHẬN XÓA DANH MỤC */}
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa danh mục"
        description="Danh mục này sẽ bị chuyển vào thùng rác."
        message={<>Bạn có chắc chắn muốn xóa danh mục này không?</>}
        confirmText="Xóa danh mục"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
