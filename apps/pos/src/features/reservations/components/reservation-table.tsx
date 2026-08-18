import type { TableReservationResponse } from "@repo/shared-features/reservations";
import { ReservationTableRow } from "./reservation-table-row";

interface ReservationTableProps {
  reservations: TableReservationResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPayDeposit: (item: TableReservationResponse) => void;
  onCheckIn: (item: TableReservationResponse) => void;
  onViewDetails: (item: TableReservationResponse) => void;
}

export function ReservationTable({
  reservations,
  isLoading,
  isError,
  onRetry,
  onPayDeposit,
  onCheckIn,
  onViewDetails,
}: ReservationTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-on-surface-variant">
        Đang tải danh sách đặt bàn...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-sm text-error gap-2">
        <span>Xảy ra lỗi khi tải dữ liệu</span>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 bg-error/10 text-error rounded-lg font-medium text-xs"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-on-surface-variant">
        Không tìm thấy thông tin đặt bàn nào
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-container-low text-on-surface-variant font-medium border-b border-outline-variant/50">
          <tr>
            <th className="p-4">Khách hàng</th>
            <th className="p-4">Bàn & Khu vực</th>
            <th className="p-4">Số khách</th>
            <th className="p-4">Thời gian nhận bàn</th>
            <th className="p-4">Trạng thái</th>
            <th className="p-4">Tiền cọc</th>
            <th className="p-4">Ghi chú</th>
            <th className="p-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {reservations.map((item) => (
            <ReservationTableRow
              key={item.id}
              item={item}
              onPayDeposit={onPayDeposit}
              onCheckIn={onCheckIn}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
