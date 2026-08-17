import React, { useState } from "react";
import { Icon } from "@repo/ui";
import {
  type TableReservationResponse,
  TableReservationStatus,
  TableAreaLabel,
  PaymentMethod,
} from "@repo/shared-features/reservations";

interface ReservationDetailModalProps {
  item: TableReservationResponse | null;
  onClose: () => void;
  onEdit: (item: TableReservationResponse) => void;
  onRequestCancel: (item: TableReservationResponse) => void;
  onNoShow?: (id: string) => void;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  item,
  onClose,
  onEdit,
  onRequestCancel,
  onNoShow,
}) => {
  const [showMore, setShowMore] = useState(false);

  if (!item) return null;

  const areaName =
    (TableAreaLabel as Record<string, string>)[item.tableArea] ||
    item.tableArea;
  const isCanceled = item.status === TableReservationStatus.CANCELLED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant w-full max-w-lg shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-on-surface">
              Chi tiết lịch đặt bàn
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowMore(false);
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition"
          >
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between bg-surface-container/50 p-3 rounded-xl">
            <span className="text-xs text-on-surface-variant">Trạng thái:</span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {item.status}
            </span>
          </div>

          {/* 1. THÔNG TIN CỐT LÕI */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <span className="text-xs text-on-surface-variant block mb-1">
                Khách hàng
              </span>
              <p className="font-semibold text-on-surface">
                {item.customerName}
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.customerPhone}
              </p>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <span className="text-xs text-on-surface-variant block mb-1">
                Vị trí & Số khách
              </span>
              <p className="font-semibold text-on-surface">
                {item.tableName} ({areaName})
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.guestCount} người
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-sm">
            <span className="text-xs text-on-surface-variant block mb-1">
              Thời gian nhận bàn
            </span>
            <p className="font-semibold text-on-surface">
              {new Date(item.reservationTime).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Pre-order items (Món đặt trước) */}
          {item.preOrderItems && item.preOrderItems.length > 0 && (
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
              <span className="text-xs font-medium text-on-surface-variant block mb-2">
                Món đặt trước ({item.preOrderItems.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {item.preOrderItems.map((prod, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-on-surface"
                  >
                    <span>
                      {prod.dishName || "Món ăn"} x{prod.quantity}
                    </span>
                    <span className="font-medium">
                      {(Number(prod.price || 0) * prod.quantity).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. NÚT MỞ RỘNG THÔNG TIN CHI TIẾT */}
          <div className="pt-2 border-t border-outline-variant/40">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full py-2 px-3 flex items-center justify-between text-xs font-medium text-primary hover:bg-surface-container rounded-xl transition"
            >
              <span>
                {showMore ? "Thu gọn thông tin" : "Xem thêm thông tin chi tiết"}
              </span>
              <Icon
                name={showMore ? "ChevronUp" : "ChevronDown"}
                className="w-4 h-4"
              />
            </button>

            {/* Nội dung Mở rộng */}
            {showMore && (
              <div className="mt-3 space-y-3 pt-2 text-xs border-t border-dashed border-outline-variant/50 animate-in fade-in duration-200">
                {/* Thông tin đặt cọc */}
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      Tiền đặt cọc:
                    </span>
                    <span className="font-semibold text-on-surface">
                      {Number(item.depositAmount || 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      Trạng thái cọc:
                    </span>
                    <span
                      className={
                        item.isDepositPaid
                          ? "text-green-600 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {item.isDepositPaid ? "Đã thanh toán" : "Chưa đặt cọc"}
                    </span>
                  </div>
                  {item.isDepositPaid && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">
                          Hình thức:
                        </span>
                        <span>{item.depositMethod || PaymentMethod.CASH}</span>
                      </div>
                      {item.depositTransactionRef && (
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">
                            Mã GD:
                          </span>
                          <span className="font-mono">
                            {item.depositTransactionRef}
                          </span>
                        </div>
                      )}
                      {item.depositPaidAt && (
                        <div className="flex justify-between">
                          <span className="text-on-surface-variant">
                            Ngày cọc:
                          </span>
                          <span>
                            {new Date(item.depositPaidAt).toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Ghi chú & Lý do hủy */}
                {item.note && (
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                    <span className="text-on-surface-variant block mb-1">
                      Ghi chú:
                    </span>
                    <p className="text-on-surface whitespace-pre-line">
                      {item.note}
                    </p>
                  </div>
                )}

                {isCanceled && item.cancelReason && (
                  <div className="bg-error/10 p-3 rounded-xl border border-error/20 text-error">
                    <span className="block font-medium mb-1">Lý do hủy:</span>
                    <p>{item.cancelReason}</p>
                  </div>
                )}
                {/* Block Món đặt trước */}
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1.5">
                    <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                      <Icon
                        name="Utensils"
                        className="w-3.5 h-3.5 text-primary"
                      />
                      Món đặt trước{" "}
                      {item.preOrderItems?.length
                        ? `(${item.preOrderItems.length})`
                        : ""}
                    </span>
                    {item.preOrderItems && item.preOrderItems.length > 0 && (
                      <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Tổng:{" "}
                        {item.preOrderItems
                          .reduce(
                            (sum, p) => sum + Number(p.price || 0) * p.quantity,
                            0,
                          )
                          .toLocaleString("vi-VN")}
                        đ
                      </span>
                    )}
                  </div>

                  {item.preOrderItems && item.preOrderItems.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {item.preOrderItems.map((prod, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs text-on-surface hover:bg-surface-container/50 p-1 rounded transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">
                              x{prod.quantity}
                            </span>
                            <span>{prod.dishName || "Món ăn"}</span>
                          </div>
                          <span className="font-medium text-on-surface-variant">
                            {(
                              Number(prod.price || 0) * prod.quantity
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant/70 italic py-1">
                      Khách hàng không đặt món trước.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-outline-variant/50 flex justify-between items-center shrink-0">
          {!isCanceled && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMore(false);
                  onRequestCancel(item);
                }}
                className="px-3 py-1.5 border border-error/30 text-error text-xs font-semibold rounded-xl hover:bg-error/10 transition"
              >
                Hủy đặt bàn
              </button>

              {onNoShow && (
                <button
                  type="button"
                  onClick={() => onNoShow(item.id)}
                  className="px-3 py-1.5 border border-outline-variant text-xs font-semibold rounded-xl hover:bg-surface-container transition text-on-surface-variant"
                >
                  Khách không đến
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            {!isCanceled && (
              <button
                type="button"
                onClick={() => {
                  setShowMore(false);
                  onEdit(item);
                }}
                className="px-4 py-2 bg-secondary text-on-secondary text-xs font-semibold rounded-xl hover:bg-secondary/90 transition"
              >
                Chỉnh sửa
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowMore(false);
                onClose();
              }}
              className="px-4 py-2 bg-surface-container text-on-surface text-xs font-semibold rounded-xl hover:bg-surface-container-high transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
