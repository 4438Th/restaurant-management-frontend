"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  DishToolbar,
  DishTable,
  DishForm,
  DishModal,
  DishAnalytics,
  DishFormSubmitData,
} from "@/features/menu/components";
import { PageHeader } from "@/components/layout";
import { ConfirmModal, TablePagination } from "@repo/ui";

import {
  useDish,
  useMenuCategory,
  useCreateDish,
  useUpdateDish,
  useDeleteDish,
  DishResponse,
  DishStatus,
  DishType,
  DishFilterParams,
  DishCreateRequest,
  DishUpdateRequest,
} from "@repo/shared-features/menu";

export default function DishesPage() {
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // STATE BỘ LỌC
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // STATE DRAWER & MODAL
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<DishResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // STATE CONFIRM DELETE MODAL
  const [dishToDelete, setDishToDelete] = useState<DishResponse | null>(null);

  // MUTATIONS
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();
  const deleteMutation = useDeleteDish();

  // Debounce tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Lấy danh sách danh mục
  const { data: categoryData } = useMenuCategory({
    page: 1,
    size: 100,
  });
  const categoriesList = categoryData?.data || [];

  // Lấy danh sách món ăn
  const dishParams: DishFilterParams = {
    page,
    size,
    search: debouncedSearch.trim() || undefined,
    status:
      selectedStatus === "All" ? undefined : (selectedStatus as DishStatus),
    type: selectedType === "All" ? undefined : (selectedType as DishType),
    categoryId: selectedCategory === "All" ? undefined : selectedCategory,
  };

  const { data: pageData, isLoading: isFetchLoading } = useDish(dishParams);
  const dishList = pageData?.data || [];
  const totalPages = pageData?.totalPages || 1;

  // HANDLERS
  const handleCreateClick = (): void => {
    setSelectedDish(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (dish: DishResponse): void => {
    setSelectedDish(dish);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (dish: DishResponse): void => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  // Mở modal xác nhận xóa
  const handleDeleteDish = (dish: DishResponse) => {
    setDishToDelete(dish);
  };

  // Thực thi hành động xóa món
  const handleConfirmDelete = () => {
    if (!dishToDelete) return;

    deleteMutation.mutate(dishToDelete.id, {
      onSuccess: () => {
        toast.success(`Đã chuyển "${dishToDelete.dishName}" vào thùng rác!`);
        setDishToDelete(null);
        // Tự động lùi trang nếu xóa phần tử cuối cùng của trang hiện tại
        if (dishList.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      },
      onError: (error) => {
        toast.error(
          error?.message || `Xóa "${dishToDelete.dishName}" thất bại!`,
        );
      },
    });
  };

  // SUBMIT TẬP TRUNG + TOAST NOTIFICATION
  const handleFormSubmit = ({
    isEditMode,
    dishId,
    dishName,
    payload,
  }: DishFormSubmitData) => {
    if (isEditMode && dishId) {
      updateMutation.mutate(
        {
          id: dishId,
          payload: payload as DishUpdateRequest,
        },
        {
          onSuccess: () => {
            toast.success(`Cập nhật món "${dishName}" thành công!`);
            setIsDrawerOpen(false);
            setSelectedDish(null);
          },
          onError: (error) => {
            toast.error(
              error?.message || `Cập nhật món "${dishName}" thất bại!`,
            );
          },
        },
      );
    } else {
      createMutation.mutate(payload as DishCreateRequest, {
        onSuccess: () => {
          toast.success(`Thêm mới món "${dishName}" thành công!`);
          setIsDrawerOpen(false);
          setSelectedDish(null);
        },
        onError: (error) => {
          toast.error(error?.message || `Tạo mới món "${dishName}" thất bại!`);
        },
      });
    }
  };

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface flex flex-col gap-6 h-full">
        <PageHeader
          title="Danh sách món"
          description="Quản lý chi tiết các món trong thực đơn."
          buttonText="Thêm món mới"
          onButtonClick={handleCreateClick}
          trashLink="/menu/dishes/trash"
        />

        <div className="flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <DishToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={(status: string) => {
              setSelectedStatus(status);
              setPage(1);
            }}
            selectedType={selectedType}
            onTypeChange={(type: string) => {
              setSelectedType(type);
              setPage(1);
            }}
            selectedCategory={selectedCategory}
            onCategoryChange={(categoryId: string) => {
              setSelectedCategory(categoryId);
              setPage(1);
            }}
            categories={categoriesList}
          />

          <div className="flex-1 overflow-auto min-h-0">
            <DishTable
              dishes={dishList}
              isLoading={isFetchLoading}
              deletingDishId={
                deleteMutation.isPending
                  ? (deleteMutation.variables as string)
                  : null
              }
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteDish}
              onRowClick={handleRowClick}
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
                unitLabel="món"
              />
            </div>
          )}
        </div>

        <DishAnalytics />
      </main>

      {/* FORM DRAWER */}
      <DishForm
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDish(null);
        }}
        dish={selectedDish}
        categories={categoriesList}
        isPending={isFormPending}
        onSubmit={handleFormSubmit}
        onErrorValidation={(msg) => toast.warning(msg)}
      />

      {/* DETAIL MODAL */}
      <DishModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDish(null);
        }}
        dish={selectedDish}
      />

      {/* MODAL XÁC NHẬN XÓA MÓN */}
      <ConfirmModal
        isOpen={!!dishToDelete}
        onClose={() => setDishToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa món"
        description="Món này sẽ bị ẩn khỏi thực đơn và chuyển vào thùng rác."
        message={<>Bạn có chắc chắn muốn xóa món này không?</>}
        confirmText="Xóa món"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
