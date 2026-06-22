import React from "react";
import { Icon } from "./icon";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconName: string;
  isError?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, iconName, isError, id, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          className="block text-[12px] font-semibold leading-[16px] text-on-surface mb-xs"
          htmlFor={id}
        >
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
            <Icon name={iconName} className="text-outline text-[20px]" />
          </div>
          <input
            id={id}
            ref={ref}
            className={`block w-full pl-xl pr-sm py-[8px] bg-surface rounded-lg text-[14px] leading-[20px] text-on-surface placeholder-outline-variant transition-all focus:outline-none border
              ${
                isError
                  ? "border-error focus:border-error focus:ring-2 focus:ring-error/10"
                  : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10"
              } ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  },
);

InputField.displayName = "InputField";
