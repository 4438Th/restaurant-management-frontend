import { AppLayout } from "@/components/layouts";
import { CategoryBar, MenuGrid } from "@/features/menu";
import {
  CreateOrderModal,
  OrderCart,
  PaymentModal,
  PosHeaderNav,
} from "@/features/pos";
import { usePosPage } from "@/features/pos/hooks/use-pos-page";

export function PosPage() {
  const {
    headerNavProps,
    categoryBarProps,
    menuGridProps,
    cartProps,
    createModalProps,
    paymentModalProps,
  } = usePosPage();

  return (
    <AppLayout title="Bán hàng - Máy POS">
      <div className="flex h-[calc(100vh-64px-2rem)] gap-4 -m-6 p-6">
        {/* KHU VỰC CHỌN MÓN CHÍNH */}
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <PosHeaderNav {...headerNavProps} />

          <CategoryBar {...categoryBarProps} />

          <div className="flex-1 overflow-y-auto pr-1">
            <MenuGrid {...menuGridProps} />
          </div>
        </div>

        {/* SIDEBAR GIỎ HÀNG */}
        <OrderCart {...cartProps} />
      </div>

      {/* MODAL CHỌN BÀN & TẠO ĐƠN */}
      <CreateOrderModal {...createModalProps} />

      {/* MODAL THANH TOÁN */}
      {paymentModalProps.isOpen && <PaymentModal {...paymentModalProps} />}
    </AppLayout>
  );
}
