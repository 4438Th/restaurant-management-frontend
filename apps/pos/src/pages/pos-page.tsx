import { AppLayout } from "@/components/layouts";
import { CategoryBar, MenuGrid, useMenuFilter } from "@/features/menu";
import {
  CreateOrderModal,
  OrderCart,
  PosHeaderNav,
  useSession,
} from "@/features/pos";
import { usePosStore } from "@/stores";

export function PosPage() {
  const {
    categories,
    filteredDishes,
    isLoading,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useMenuFilter();

  const addToCart = usePosStore((state) => state.addToCart);

  const {
    isCreateModalOpen,
    handleCloseCreateModal,
    handleCreateOrderSubmit,
    tables,
    isTablesLoading,
  } = useSession();

  return (
    <AppLayout title="Bán hàng - Máy POS">
      <div className="flex h-[calc(100vh-64px-2rem)] gap-4 -m-6 p-6">
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <PosHeaderNav />

          <CategoryBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          <div className="flex-1 overflow-y-auto pr-1">
            <MenuGrid
              dishes={filteredDishes}
              onAddToCart={addToCart}
              isLoading={isLoading}
            />
          </div>
        </div>

        <OrderCart />
      </div>

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateOrderSubmit}
        tables={tables}
        isTablesLoading={isTablesLoading}
      />
    </AppLayout>
  );
}
