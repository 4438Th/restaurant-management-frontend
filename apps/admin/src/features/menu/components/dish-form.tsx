"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { CldUploadWidget } from "next-cloudinary";
import {
  DishResponse,
  DishCreateRequest,
  DishUpdateRequest,
  DishStatusLabel,
  DishTypeLabel,
  MenuCategoryFilterParams,
} from "../menu.types";
import { useCreateDish, useUpdateDish } from "../hooks/dishes.hooks";
import { useMenuCategory } from "../hooks/categories.hooks";

interface DishFormProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishResponse | null;
}

export function DishForm({ isOpen, onClose, dish }: DishFormProps) {
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();
  const filterParams: MenuCategoryFilterParams = {
    page: 1,
    size: 100,
  };
  const { data: categoriesData } = useMenuCategory(filterParams);
  const categories = categoriesData?.data || [];

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [unit, setUnit] = useState("Đĩa");

  // Lưu state dưới dạng chuỗi Key (gốc từ API) thay vì gán cứng Enum tiếng Việt
  const [type, setType] = useState<string>("FOOD");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<string>("AVAILABLE");

  useEffect(() => {
    if (dish) {
      setDishName(dish.dishName || "");
      setDescription(dish.description || "");
      setPrice(dish.price || "");
      setImageUrl(dish.imageUrl || "");
      setUnit(dish.unit || "Đĩa");
      setType(dish.type || "FOOD");
      setCategoryId(dish.category?.id || "");
      setStatus(dish.status || "AVAILABLE");
    } else {
      setDishName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setUnit("Đĩa");
      setType("FOOD");
      setCategoryId("");
      setStatus("AVAILABLE");
    }
  }, [dish, isOpen]);

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !price || !categoryId || !unit) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    const basePayload = {
      dishName,
      description,
      price,
      imageUrl,
      unit,
      type, // Gửi chuỗi Key lên backend ('FOOD' hoặc 'BEVERAGE')
      categoryId,
    };

    if (dish) {
      updateMutation.mutate(
        {
          id: dish.id,
          payload: { ...basePayload, status } as DishUpdateRequest,
        },
        { onSuccess: () => onClose() },
      );
    } else {
      createMutation.mutate(basePayload as DishCreateRequest, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface p-6 h-full shadow-xl flex flex-col gap-4 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-outline-variant pb-4 shrink-0">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Icon
              name={dish ? "Pencil" : "Plus"}
              className="w-5 h-5 text-primary"
            />
            {dish ? "Cập nhật món" : "Thêm món mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto text-[14px] flex flex-col gap-4 pr-1">
            {/* KHU VỰC UPLOAD VÀ PREVIEW ẢNH MÓN */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Hình ảnh món
              </label>
              <CldUploadWidget
                uploadPreset="dish_preset"
                onSuccess={(results: unknown) => {
                  const res = results as { info?: { secure_url?: string } };
                  if (res?.info?.secure_url) {
                    setImageUrl(res.info.secure_url);
                  }
                }}
                options={{
                  multiple: false,
                  clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
                  maxFileSize: 2000000,
                }}
              >
                {({ open }) => {
                  return (
                    <div className="flex flex-col gap-3">
                      {imageUrl ? (
                        <div className="relative group w-full h-40 rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt="Preview món"
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-40"
                          />
                          <button
                            type="button"
                            onClick={() => open()}
                            className="absolute opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all hover:bg-black/80 flex items-center gap-1.5"
                          >
                            <Icon name="RefreshCw" className="w-4 h-4" />
                            Đổi ảnh khác
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full h-32 border-2 border-dashed border-outline-variant hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-surface-bright text-on-surface-variant hover:text-primary transition-colors group"
                        >
                          <div className="p-2.5 rounded-full bg-surface-container group-hover:bg-primary/10 transition-colors">
                            <Icon name="UploadCloud" className="w-5 h-5" />
                          </div>
                          <div className="text-[12px] font-bold">
                            Bấm vào đây để tải ảnh từ máy lên
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            Chấp nhận JPG, PNG, WEBP tối đa 2MB
                          </div>
                        </button>
                      )}
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>

            {/* TÊN MÓN */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Tên món <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cơm rang dưa bò"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                required
              />
            </div>

            {/* DANH MỤC */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Danh mục thực đơn <span className="text-error">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* PHÂN LOẠI & ĐƠN VỊ TÍNH */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Phân loại <span className="text-error">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                >
                  {Object.keys(DishTypeLabel).map((key) => (
                    <option key={key} value={key}>
                      {DishTypeLabel[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Đơn vị tính <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đĩa, Bát, Lon..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                  required
                />
              </div>
            </div>

            {/* ĐƠN GIÁ */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Đơn giá (VND) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 55000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-mono font-bold"
                required
              />
            </div>

            {/* TRẠNG THÁI PHỤC VỤ*/}
            {dish && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Trạng thái phục vụ
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                >
                  {Object.keys(DishStatusLabel)
                    .filter((key) => key !== "DELETED") // Đã loại bỏ trạng thái DELETED tại đây
                    .map((key) => (
                      <option key={key} value={key}>
                        {DishStatusLabel[key]}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* MÔ TẢ NGẮN */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Mô tả ngắn
              </label>
              <textarea
                placeholder="Nhập ghi chú thành phần hoặc mô tả món..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface resize-none font-medium"
              />
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="border-t border-outline-variant pt-4 mt-4 flex gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 bg-surface-variant text-on-surface hover:bg-surface-container rounded-xl text-[13px] font-bold transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isPending && (
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              )}
              <span>{dish ? "Lưu thay đổi" : "Tạo món"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
