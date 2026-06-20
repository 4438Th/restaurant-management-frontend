import { cn } from "@/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "default";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variant === "success" && "bg-green-100 text-green-700",
        variant === "danger" && "bg-red-100 text-red-700",
        variant === "default" && "bg-gray-100 text-gray-700",
      )}
    >
      {children}
    </span>
  );
}
