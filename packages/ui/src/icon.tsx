import React from "react";
import * as Icons from "lucide-react";

// Export TypeIconName dùng chung cho toàn bộ Monorepo
export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  const LucideIcon = Icons[name] as React.ComponentType<{ className?: string }>;

  // Kiểm tra tồn tại và đảm bảo nó thực sự là một Component React
  if (!LucideIcon || typeof LucideIcon !== "function") {
    return <Icons.HelpCircle className={className} {...props} />;
  }

  return <LucideIcon className={className} {...props} />;
}
