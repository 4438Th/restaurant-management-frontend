import * as Icons from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const LucideIcon = Icons[name] as React.ComponentType<{ className?: string }>;

  if (!LucideIcon) {
    return <Icons.HelpCircle className={className} />;
  }

  return <LucideIcon className={className} />;
}
