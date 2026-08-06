"use client";

import React from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  page: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  unitLabel?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalElements,
  page,
  onPageChange,
  unitLabel = "bản ghi",
}: TablePaginationProps) {
  return (
    <div className="p-4 flex justify-between items-center bg-surface-bright text-[13px] text-on-surface-variant font-medium select-none">
      <div>
        Trang <span className="text-on-surface font-bold">{currentPage}</span>{" "}
        trên <span className="text-on-surface font-bold">{totalPages}</span> (
        Tổng: {totalElements} {unitLabel})
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 text-[12px] font-bold"
        >
          Trước
        </button>
        <span className="px-3 text-[13px] font-black text-primary">{page}</span>
        <button
          type="button"
          onClick={() => onPageChange((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 text-[12px] font-bold"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
