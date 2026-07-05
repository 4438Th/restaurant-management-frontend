// apps/admin/src/features/menu/components/menu-category-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@repo/core";
import { Icon } from "@/components/ui/icon";
// Import các custom hooks ông đã viết sẵn
import {
  useCreateMenuCategory,
  useUpdateMenuCategory,
} from "../hooks/categories.hooks";
import { MenuCategoryResponse, MenuCategoryStatus } from "../menu.types";

export interface MenuCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: MenuCategoryResponse | null;
}

export function MenuCategoryForm({
  isOpen,
  onClose,
  category,
}: MenuCategoryFormProps) {
  // Gọi các hooks đột biến (mutation hooks) tương tự bên UserForm
  const createCategoryMutation = useCreateMenuCategory();
  const updateCategoryMutation = useUpdateMenuCategory();

  const isEditMode = !!category;

  // State quản lý thông tin form danh mục
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<MenuCategoryStatus>(
    MenuCategoryStatus.ACTIVE,
  );

  // Đồng bộ hóa dữ liệu khi trạng thái Drawer hoặc dữ liệu thay đổi
  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || "");
      setDescription(category.description || "");
      setStatus(category.status || MenuCategoryStatus.ACTIVE);
    } else {
      setCategoryName("");
      setDescription("");
      setStatus(MenuCategoryStatus.ACTIVE);
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (isEditMode && category) {
      updateCategoryMutation.mutate(
        {
          id: category.id,
          payload: {
            categoryName: categoryName.trim(),
            description: description.trim(),
            status,
          },
        },
        {
          onSuccess: () => onClose(),
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể cập nhật danh mục!");
          },
        },
      );
    } else {
      createCategoryMutation.mutate(
        {
          categoryName: categoryName.trim(),
          description: description.trim(),
        },
        {
          onSuccess: () => onClose(),
          onError: (error: ApiError) => {
            toast.error(error.message || "Không thể tạo danh mục!");
          },
        },
      );
    }
  };

  if (!isOpen) return null;

  const isPending =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <>
      {/* Backdrop nền tối mờ */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Panel Form Drawer trượt từ bên phải vào */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-container-lowest border-l border-outline-variant z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <div>
            <h3 className="text-[18px] font-bold text-on-surface">
              {isEditMode ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </h3>
            <p className="text-[12px] text-on-surface-variant">
              {isEditMode
                ? `Đang chỉnh sửa: ${category?.categoryName}`
                : "Thêm danh mục món ăn mới vào thực đơn hệ thống nhà hàng"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
        >
          {/* Tên danh mục */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Tên danh mục món ăn
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ví dụ: Đồ khai vị, Món lẩu, Đồ uống..."
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              required
            />
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Mô tả danh mục
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả giới thiệu về nhóm món ăn này..."
              rows={4}
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
            />
          </div>

          {/* Trạng thái danh mục (Chỉ hiển thị khi cập nhật) */}
          {isEditMode && (
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">
                Trạng thái hoạt động
              </label>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setStatus(MenuCategoryStatus.ACTIVE)}
                  className={`flex-1 py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    status === MenuCategoryStatus.ACTIVE
                      ? "bg-success/10 text-green-600 font-bold border-green-500"
                      : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${status === MenuCategoryStatus.ACTIVE ? "bg-green-600" : "bg-neutral-400"}`}
                  />
                  Hoạt động
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(MenuCategoryStatus.INACTIVE)}
                  className={`flex-1 py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    status === MenuCategoryStatus.INACTIVE
                      ? "bg-error/10 border-error text-error font-bold"
                      : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${status === MenuCategoryStatus.INACTIVE ? "bg-error" : "bg-neutral-400"}`}
                  />
                  Tạm ẩn
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(MenuCategoryStatus.DRAFT)}
                  className={`flex-1 py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    status === MenuCategoryStatus.DRAFT
                      ? "bg-amber-500/10 text-amber-600 font-bold border-amber-500"
                      : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${status === MenuCategoryStatus.DRAFT ? "bg-amber-500" : "bg-neutral-400"}`}
                  />
                  Bản nháp
                </button>
              </div>
            </div>
          )}

          {/* Các nút hành động ở cuối Drawer */}
          <div className="mt-auto pt-6 border-t border-outline-variant flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-bright border border-outline-variant hover:bg-surface-variant text-on-surface py-2.5 rounded-xl font-semibold text-[14px] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl font-semibold text-[14px] transition-colors disabled:opacity-50"
            >
              {isPending
                ? "Đang xử lý..."
                : isEditMode
                  ? "Cập nhật"
                  : "Lưu danh mục"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
