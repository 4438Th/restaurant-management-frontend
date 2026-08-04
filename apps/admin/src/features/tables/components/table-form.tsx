"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@repo/ui";
import {
  TableResponse,
  TableCreateRequest,
  TableUpdateRequest,
  TableStatus,
  TableStatusLabel,
  TableType,
  TableTypeLabel,
  TableArea,
  TableAreaLabel,
} from "@repo/shared-features/tables";

export interface TableFormSubmitData {
  isEditMode: boolean;
  tableId?: string;
  tableName: string;
  payload: TableCreateRequest | TableUpdateRequest;
}

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  table?: TableResponse | null;
  isPending?: boolean;
  onSubmit: (data: TableFormSubmitData) => void;
  onErrorValidation?: (message: string) => void;
}

export function TableForm({
  isOpen,
  onClose,
  table,
  isPending = false,
  onSubmit,
  onErrorValidation,
}: TableFormProps) {
  const isEditMode = !!table;

  // Local State
  const [tableName, setTableName] = useState("");
  const [capacity, setCapacity] = useState<number | string>(4);
  const [type, setType] = useState<string>("STANDARD");
  const [area, setArea] = useState<string>("MAIN_HALL");
  const [status, setStatus] = useState<string>("AVAILABLE");

  // Đồng bộ thông tin dữ liệu khi mở Drawer/Modal
  useEffect(() => {
    if (table && isOpen) {
      setTableName(table.tableName || "");
      setCapacity(table.capacity || 4);
      setType(table.type || "STANDARD");
      setArea(table.area || "MAIN_HALL");
      setStatus(table.status || "AVAILABLE");
    } else if (!isOpen) {
      setTableName("");
      setCapacity(4);
      setType("STANDARD");
      setArea("MAIN_HALL");
      setStatus("AVAILABLE");
    }
  }, [table, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tableName.trim() || !capacity || !area || !type) {
      onErrorValidation?.("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    const basePayload = {
      tableName: tableName.trim(),
      capacity: Number(capacity),
      type: type as TableType,
      area: area as TableArea,
    };

    if (isEditMode && table) {
      const updatePayload: TableUpdateRequest = {
        ...basePayload,
        status: status as TableStatus,
      };

      onSubmit({
        isEditMode: true,
        tableId: table.id,
        tableName: tableName.trim(),
        payload: updatePayload,
      });
    } else {
      onSubmit({
        isEditMode: false,
        tableName: tableName.trim(),
        payload: basePayload as TableCreateRequest,
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
              name={isEditMode ? "Pencil" : "Plus"}
              className="w-5 h-5 text-primary"
            />
            {isEditMode ? "Cập nhật bàn ăn" : "Thêm bàn mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto text-[14px] flex flex-col gap-4 pr-1">
            {/* TÊN BÀN / SỐ BÀN */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Tên bàn / Số bàn <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Bàn 01, VIP 2..."
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium"
                required
              />
            </div>

            {/* SỨC CHỨA */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-on-surface-variant">
                Sức chứa (Số người) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                placeholder="Ví dụ: 4"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-mono font-bold"
                required
              />
            </div>

            {/* KHU VỰC VÀ LOẠI BÀN */}
            <div className="grid grid-cols-2 gap-4">
              {/* KHU VỰC */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Khu vực <span className="text-error">*</span>
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                  required
                >
                  {Object.keys(TableAreaLabel).map((key) => (
                    <option key={key} value={key}>
                      {TableAreaLabel[key as TableArea]}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOẠI BÀN */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Loại bàn <span className="text-error">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                  required
                >
                  {Object.keys(TableTypeLabel).map((key) => (
                    <option key={key} value={key}>
                      {TableTypeLabel[key as TableType]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TRẠNG THÁI (Chỉ hiển thị khi cập nhật) */}
            {isEditMode && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface-variant">
                  Trạng thái bàn
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-bright border border-outline-variant rounded-xl focus:border-primary outline-none transition-all text-on-surface font-medium cursor-pointer"
                >
                  {Object.keys(TableStatusLabel)
                    .filter((key) => key !== "DELETED")
                    .map((key) => (
                      <option key={key} value={key}>
                        {TableStatusLabel[key as TableStatus]}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="border-t border-outline-variant pt-4 mt-4 flex gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 bg-surface-variant text-on-surface hover:bg-surface-container rounded-xl text-[13px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-xl text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isPending && (
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isEditMode ? "Lưu thay đổi" : "Tạo bàn mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
