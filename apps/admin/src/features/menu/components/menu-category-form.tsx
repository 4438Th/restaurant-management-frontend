"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@repo/ui";
import {
  MenuCategoryResponse,
  MenuCategoryStatusLabel,
  MenuCategoryStatus,
} from "@repo/shared-features/menu";

export interface MenuCategoryFormValues {
  categoryName: string;
  description: string;
  status: MenuCategoryStatus;
}

export interface MenuCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: MenuCategoryResponse | null;
  onSubmit: (values: MenuCategoryFormValues) => Promise<void> | void;
  isPending?: boolean;
}

export function MenuCategoryForm({
  isOpen,
  onClose,
  category,
  onSubmit,
  isPending = false,
}: MenuCategoryFormProps) {
  const isEditMode = !!category;

  const [formData, setFormData] = useState<MenuCategoryFormValues>({
    categoryName: "",
    description: "",
    status: MenuCategoryStatus.ACTIVE,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Đồng bộ dữ liệu khi mở/đóng drawer hoặc đổi category
  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        categoryName: category.categoryName || "",
        description: category.description || "",
        status:
          (category.status as MenuCategoryStatus) || MenuCategoryStatus.ACTIVE,
      });
    } else if (!isOpen) {
      setFormData({
        categoryName: "",
        description: "",
        status: MenuCategoryStatus.ACTIVE,
      });
    }
    setErrorMessage("");
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryName.trim()) {
      setErrorMessage("Vui lòng nhập tên danh mục!");
      return;
    }

    setErrorMessage("");

    await onSubmit({
      ...formData,
      categoryName: formData.categoryName.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface p-6 h-full shadow-2xl flex flex-col gap-4 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-outline-variant pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Icon
                name={isEditMode ? "Pencil" : "Plus"}
                className="w-5 h-5 text-primary"
              />
              {isEditMode ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </h2>
            <p className="text-[12px] text-on-surface-variant mt-0.5">
              {isEditMode
                ? `Đang chỉnh sửa: ${category?.categoryName}`
                : "Thêm danh mục món ăn mới vào hệ thống"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer disabled:opacity-50"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto text-[14px] flex flex-col gap-4 pr-1">
            {/* THÔNG BÁO LỖI NẾU CÓ */}
            {errorMessage && (
              <div className="p-3 text-[13px] text-error bg-error/10 border border-error/20 rounded-xl font-medium flex items-center gap-2">
                <Icon name="AlertCircle" className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TÊN DANH MỤC */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant text-[13px]">
                Tên danh mục <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Món khai vị, Đồ uống..."
                value={formData.categoryName}
                disabled={isPending}
                onChange={(e) => {
                  setFormData({ ...formData, categoryName: e.target.value });
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium disabled:opacity-60"
                required
              />
            </div>

            {/* MÔ TẢ DANH MỤC */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant text-[13px]">
                Mô tả danh mục
              </label>
              <textarea
                placeholder="Nhập mô tả ngắn về danh mục này..."
                value={formData.description}
                disabled={isPending}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface resize-none font-medium disabled:opacity-60"
              />
            </div>

            {/* TRẠNG THÁI HOẠT ĐỘNG (Chỉ khi chỉnh sửa) */}
            {isEditMode && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant text-[13px]">
                  Trạng thái hoạt động
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    Object.entries(MenuCategoryStatusLabel) as [
                      MenuCategoryStatus,
                      string,
                    ][]
                  )
                    .filter(
                      ([statusKey]) => statusKey !== MenuCategoryStatus.DELETED,
                    )
                    .map(([statusKey, label]) => {
                      const isSelected = formData.status === statusKey;

                      return (
                        <button
                          key={statusKey}
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              status: statusKey,
                            }))
                          }
                          className={`py-2 px-3 text-[12px] font-semibold border rounded-xl transition-all cursor-pointer disabled:opacity-50 ${
                            isSelected
                              ? "bg-primary text-on-primary border-primary shadow-sm"
                              : "bg-surface-bright border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="border-t border-outline-variant pt-4 mt-4 flex gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 bg-surface-variant text-on-surface hover:bg-surface-container rounded-xl text-[13px] font-bold transition-colors disabled:opacity-50 cursor-pointer text-center"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-primary text-on-primary hover:bg-primary/90 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isPending && (
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isPending ? "Đang xử lý..." : "Lưu thay đổi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
