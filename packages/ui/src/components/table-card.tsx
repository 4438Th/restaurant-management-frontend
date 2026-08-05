import React from "react";
import { Icon } from "./icon";

// 1. Định nghĩa kiểu dữ liệu trạng thái bàn
export type TableStatusUI =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "MAINTENANCE"
  | string;

// 2. Định nghĩa cấu trúc theme cho thẻ
interface StatusTheme {
  cardClass: string; // Class bọc nền và viền thẻ
  textClass: string; // Class định dạng chữ trạng thái
}

// Maintenance sử dụng các Token CSS từ Material/Tailwind v4 đã khai báo
const defaultTheme: StatusTheme = {
  cardClass:
    "bg-surface-container-low border-outline-variant border-dashed border-2",
  textClass: "text-on-surface-variant font-bold",
};

// Map trực tiếp trạng thái sang các Utility class chuẩn trong global.css
const statusColorMap: Record<string, StatusTheme> = {
  AVAILABLE: {
    cardClass: "status-available",
    textClass: "font-bold",
  },
  OCCUPIED: {
    cardClass: "status-occupied",
    textClass: "font-bold",
  },
  RESERVED: {
    cardClass: "status-reserved",
    textClass: "font-bold",
  },
  MAINTENANCE: defaultTheme,
};

// 3. Props Component TableCard
export interface TableCardProps {
  id: string;
  tableName: string;
  capacity?: number;
  status: TableStatusUI;
  onClick?: (id: string) => void;
  className?: string;
  actionSlot?: React.ReactNode;
}

export const TableCard: React.FC<TableCardProps> = ({
  id,
  tableName,
  capacity,
  status,
  onClick,
  className = "",
  actionSlot,
}) => {
  const theme = statusColorMap[status] ?? defaultTheme;

  return (
    <div
      onClick={() => onClick?.(id)}
      className={`
        relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none
        flex flex-col justify-between min-h-[110px] hover:shadow-md hover:-translate-y-0.5
        ${theme.cardClass}
        ${className}
      `}
    >
      {/* Header card: Tên bàn & Nút thao tác */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-on-surface text-base leading-tight truncate">
          {tableName}
        </h4>
        {actionSlot && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {actionSlot}
          </div>
        )}
      </div>

      {/* Footer card: Trạng thái & Sức chứa */}
      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-outline-variant/40">
        <span
          className={`font-bold text-[11px] uppercase tracking-wide ${theme.textClass}`}
        >
          {status}
        </span>

        {capacity !== undefined && (
          <div className="flex items-center gap-1.5 text-on-surface-variant font-semibold text-[11px]">
            <Icon name="Users" className="w-3.5 h-3.5 shrink-0" />
            <span>{capacity} người</span>
          </div>
        )}
      </div>
    </div>
  );
};
