"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui";
import {
  useCreateMenuCategory,
  useUpdateMenuCategory,
} from "@repo/shared-features/menu";
import {
  MenuCategoryResponse,
  MenuCategoryStatusLabel,
} from "@repo/shared-features/menu";

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
  const createMutation = useCreateMenuCategory();
  const updateMutation = useUpdateMenuCategory();

  const isEditMode = !!category;
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName,
        description: category.description || "",
        status: category.status,
      });
    } else {
      setFormData({ categoryName: "", description: "", status: "ACTIVE" });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục!");
      return;
    }

    try {
      if (isEditMode && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch {
      // Đã xử lý toast ở hook
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

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
                : "Thêm danh mục món ăn mới"}
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
          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Tên danh mục <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.categoryName}
              disabled={isPending}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-on-surface mb-2">
              Mô tả danh mục
            </label>
            <textarea
              value={formData.description}
              disabled={isPending}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 text-[14px] bg-surface-bright border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none disabled:opacity-60"
            />
          </div>

          {isEditMode && (
            <div>
              <label className="block text-[12px] font-bold text-on-surface mb-2">
                Trạng thái hoạt động
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(MenuCategoryStatusLabel).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={isPending}
                    onClick={() => setFormData({ ...formData, status: key })}
                    className={`py-2 text-[12px] font-semibold border rounded-xl transition-all ${
                      formData.status === key
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-6 border-t border-outline-variant flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 bg-surface-bright border border-outline-variant hover:bg-surface-variant text-on-surface rounded-xl font-semibold text-[14px] transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-xl font-semibold text-[14px] transition-all disabled:opacity-50"
            >
              {isPending ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
