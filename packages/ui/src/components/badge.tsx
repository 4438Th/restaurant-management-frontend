import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
  className?: string;
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
  outline: "text-foreground border-border",
  success: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  return (
    <span className={`${baseStyles} ${variantStyle} ${className}`} {...props}>
      {children}
    </span>
  );
}
