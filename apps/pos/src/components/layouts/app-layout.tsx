import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { PageHeader } from "./page-header";

export interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
}

export function AppLayout({ children, title, actionButton }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <PageHeader title={title} actionButton={actionButton} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-(--spacing-custom-lg)">
          {children}
        </main>
      </div>
    </div>
  );
}
