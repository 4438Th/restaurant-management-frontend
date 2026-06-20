import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-sm outline-none",
          "focus:ring-2 focus:ring-blue-500",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
