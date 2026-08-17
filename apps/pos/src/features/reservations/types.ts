import type { DishResponse } from "@repo/shared-features/menu";

// Data form đặt bàn
export type ReservationFormData = {
    tableId: string;
    customerName: string;
    customerPhone: string;
    guestCount: number;
    reservationTime: string;
    note?: string;
};

// Item trong giỏ hàng chọn món trước (Dùng cho cả Cart, Step 2 và Payload)
export type PreOrderItem = {
    dish: DishResponse;
    quantity: number;
};

// Payload hoàn chỉnh gửi lên API khi bấm submit
export type ReservationSubmitPayload = {
    formData: ReservationFormData;
    preOrderItems: PreOrderItem[];
};