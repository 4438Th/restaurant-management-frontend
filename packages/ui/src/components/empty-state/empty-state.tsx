interface EmptyStateProps {
  title?: string;
}

export function EmptyState({ title = "No data" }: EmptyStateProps) {
  return (
    <div className="rounded border p-8 text-center text-gray-500">{title}</div>
  );
}
