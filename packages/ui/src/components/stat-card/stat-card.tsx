interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
