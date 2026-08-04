import React from "react";
import * as Icons from "lucide-react";

export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  // Lấy icon từ gói lucide-react
  const LucideIcon = Icons[name] as React.ElementType;

  // Kiểm tra nếu icon tồn tại
  if (!LucideIcon) {
    // Lưu ý: Dùng CircleHelp (Lucide mới) hoặc HelpCircle (Lucide cũ)
    const FallbackIcon = (Icons.CircleHelp ||
      Icons.HelpCircle) as React.ElementType;
    return FallbackIcon ? (
      <FallbackIcon className={className} {...props} />
    ) : null;
  }

  return <LucideIcon className={className} {...props} />;
}
