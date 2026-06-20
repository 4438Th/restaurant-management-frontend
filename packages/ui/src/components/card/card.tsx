import type { HTMLAttributes } from "react";

import { cn } from "@/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border bg-white shadow-sm", className)}
      {...props}
    />
  );
}
