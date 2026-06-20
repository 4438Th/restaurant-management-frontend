interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="rounded bg-gray-100 px-2 py-1 text-xs">{children}</span>
  );
}
