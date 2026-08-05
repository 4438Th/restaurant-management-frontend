import { useState, useMemo } from "react";
import {
  useReservation,
  useCreateReservation,
  useUpdateReservation,
  useArriveReservation,
  useCompleteReservation,
  useNoShowReservation,
  useCancelReservation,
  type TableReservationResponse,
  type TableReservationCreateRequest,
  type TableReservationUpdateRequest,
} from "@repo/shared-features/reservations";
import { type TableResponse, useTable } from "@repo/shared-features/tables";
import { AppLayout } from "@/components/layouts";
import {
  ReservationToolbar,
  ReservationTable,
  ReservationCancelModal,
  ReservationFormModal,
} from "@/features/reservations";

export function ReservationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // State Modal Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<TableReservationResponse | null>(null);

  // State Modal Hủy
  const [cancelModalItem, setCancelModalItem] =
    useState<TableReservationResponse | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Gọi Hook danh sách bàn ở trang cha
  const { data: tablesData } = useTable();
  const tables: TableResponse[] = useMemo(() => {
    if (Array.isArray(tablesData)) return tablesData;
    return tablesData?.data ?? [];
  }, [tablesData]);

  // Hook Đặt bàn
  const {
    data: reservationsData,
    isLoading,
    isError,
    refetch,
  } = useReservation({
    search: searchQuery || undefined,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
  });

  const createMutation = useCreateReservation();
  const updateMutation = useUpdateReservation();
  const arriveMutation = useArriveReservation();
  const completeMutation = useCompleteReservation();
  const noShowMutation = useNoShowReservation();
  const cancelMutation = useCancelReservation();

  const reservations: TableReservationResponse[] = useMemo(() => {
    if (Array.isArray(reservationsData)) return reservationsData;
    return (
      (reservationsData as unknown as { data: TableReservationResponse[] })
        ?.data ?? []
    );
  }, [reservationsData]);

  const handleFormSubmit = async (
    data: TableReservationCreateRequest | TableReservationUpdateRequest,
  ) => {
    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        payload: data as TableReservationUpdateRequest,
      });
    } else {
      await createMutation.mutateAsync(data as TableReservationCreateRequest);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalItem || !cancelReason.trim()) return;
    await cancelMutation.mutateAsync({
      id: cancelModalItem.id,
      payload: { cancelReason },
    });
    setCancelModalItem(null);
    setCancelReason("");
  };

  return (
    <AppLayout title="Quản lý lịch đặt bàn ">
      <div className="flex flex-col gap-4 h-full">
        <ReservationToolbar
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onStatusChange={setSelectedStatus}
          onCreateNew={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        />

        <div className="flex-1 overflow-y-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/50">
          <ReservationTable
            reservations={reservations}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onArrive={(id) => arriveMutation.mutate(id)}
            onComplete={(id) => completeMutation.mutate(id)}
            onNoShow={(id) => noShowMutation.mutate(id)}
            onRequestCancel={setCancelModalItem}
          />
        </div>
      </div>

      {/* Truyền prop tables trực tiếp vào Pure UI Modal */}
      <ReservationFormModal
        key={editingItem ? editingItem.id : "new"}
        isOpen={isFormOpen}
        tables={tables}
        initialData={editingItem}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <ReservationCancelModal
        item={cancelModalItem}
        reason={cancelReason}
        isSubmitting={cancelMutation.isPending}
        onReasonChange={setCancelReason}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          setCancelModalItem(null);
          setCancelReason("");
        }}
      />
    </AppLayout>
  );
}
