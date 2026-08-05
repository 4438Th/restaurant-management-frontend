import { AppLayout } from "@/components/layouts";

export function DashboardPage() {
  return (
    <AppLayout title="Bảng điều khiển">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-(--spacing-custom-gutter)">
        <div className="p-(--spacing-custom-md) bg-surface-container rounded-2xl border border-outline-variant">
          <p className="text-sm text-on-surface-variant font-medium">
            Tổng doanh thu
          </p>
          <p className="text-2xl font-bold text-primary mt-1">$24,500</p>
        </div>

        <div className="p-(--spacing-custom-md) bg-secondary-container rounded-2xl border border-outline-variant">
          <p className="text-sm text-on-secondary-container font-medium">
            Lượt truy cập
          </p>
          <p className="text-2xl font-bold text-on-secondary-container mt-1">
            1,240
          </p>
        </div>

        <div className="p-(--spacing-custom-md) bg-tertiary-container rounded-2xl border border-outline-variant">
          <p className="text-sm text-on-tertiary-container font-medium">
            Cảnh báo hệ thống
          </p>
          <p className="text-2xl font-bold text-on-tertiary-container mt-1">
            3 yêu cầu
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
