import { AppLayout } from "@/components/layouts";
import { useKitchenItems } from "@repo/shared-features";
import { useKitchenFilters, useKitchenActions } from "@/features/kds";
import { KdsHeaderNav, KitchenBoard } from "@/features/kds";

export function KdsPage() {
  const { selectedStatus, setSelectedStatus, searchTerm, setSearchTerm } =
    useKitchenFilters();
  const { handleUpdateStatus, isUpdating } = useKitchenActions();

  const { data: response, isLoading } = useKitchenItems({
    status: selectedStatus,
  });

  const items = response?.data || [];

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.dishName.toLowerCase().includes(term) ||
      item.orderId.toLowerCase().includes(term)
    );
  });

  return (
    <AppLayout title="Màn hình Bếp (KDS)">
      <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] gap-4 p-6 bg-slate-100 overflow-hidden">
        <KdsHeaderNav
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <KitchenBoard
          items={filteredItems}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      </div>
    </AppLayout>
  );
}
