import React from "react";

export interface PageHeaderProps {
  title?: string;
  actionButton?: React.ReactNode;
}

export function PageHeader({
  title = "Tổng quan",
  actionButton,
}: PageHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-(--spacing-custom-lg)">
      <h1 className="text-xl font-semibold text-on-surface">{title}</h1>

      <div className="flex items-center gap-3">
        {actionButton || (
          <button
            type="button"
            className="bg-primary text-on-primary px-4 py-2 rounded-full font-medium text-sm hover:bg-primary-container transition"
          >
            + Tạo mới
          </button>
        )}
      </div>
    </header>
  );
}
