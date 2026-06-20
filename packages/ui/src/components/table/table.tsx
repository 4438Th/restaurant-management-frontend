import type { HTMLAttributes } from "react";

import { cn } from "@/utils";

type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className, ...props }: TableProps) {
  return (
    <table className={cn("w-full border-collapse", className)} {...props} />
  );
}
