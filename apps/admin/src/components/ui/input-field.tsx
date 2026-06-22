import React from "react";
import * as Icons from "lucide-react";
import { Icon } from "./icon";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconName: keyof typeof Icons;
  isError?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, iconName, isError, id, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-[12px] font-semibold leading-[16px] text-on-surface mb-1"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name={iconName} className="text-outline w-5 h-5" />
          </div>
          <input
            id={id}
            ref={ref}
            className={`block w-full pl-10 pr-3 py-2.5 bg-surface rounded-lg text-[14px] leading-[20px] text-on-surface placeholder-outline-variant transition-all focus:outline-none border input-glow
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
