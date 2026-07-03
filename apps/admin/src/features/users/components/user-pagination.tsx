import React from "react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  page: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
}

export function UserPagination({
  currentPage,
  totalPages,
  totalElements,
  page,
  onPageChange,
}: UserPaginationProps) {
  return (
    <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-bright text-[13px] text-on-surface-variant font-medium">
      <div>
        Hiển thị trang{" "}
        <span className="text-on-surface font-bold">{currentPage}</span> trên{" "}
        <span className="text-on-surface font-bold">{totalPages}</span> (
        {totalElements} tài khoản)
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-40 text-[12px] font-bold"
        >
          Trước
        </button>
        <span className="px-3 text-[13px] font-black text-primary">{page}</span>
        <button
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
