import React from "react";
import { Icon } from "./icon";

interface ErrorBannerProps {
  title?: string;
  message: string;
}

export function ErrorBanner({
  title = "Authentication Failed",
  message,
}: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="mb-4 p-4 bg-error-container/20 border border-error/30 rounded-lg flex items-start gap-3 animate-fadeIn">
      <Icon name="AlertTriangle" className="text-error mt-0.5 w-5 h-5" />
      <div>
        <p className="text-[12px] font-semibold leading-[16px] text-error">
          {title}
        </p>
        <p className="text-[14px] font-normal leading-[20px] text-on-error-container mt-1">
          {message}
        </p>
      </div>
    </div>
  );
}
