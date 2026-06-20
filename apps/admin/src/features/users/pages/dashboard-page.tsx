"use client";

import { StatCard } from "@repo/ui";

export function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard title="Users" value="12" />

      <StatCard title="Roles" value="4" />

      <StatCard title="Permissions" value="15" />
    </div>
  );
}
