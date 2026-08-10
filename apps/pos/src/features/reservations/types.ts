import type { TableReservationResponse } from "@repo/shared-features/reservations";

export type ReservationFormData = {
    tableId: string;
    customerName: string;
    customerPhone: string;
    guestCount: number;
    reservationTime: string;
    note?: string;
};

// Hàm chuyển đổi ISO sang định dạng datetime-local của HTML
export function formatIsoToLocalInput(isoString?: string): string {
    if (!isoString) {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    return isoString.slice(0, 16);
}

// Hàm chuyển đổi từ datetime-local sang định dạng chuẩn LocalDateTime của Backend
export function formatLocalInputToLocalDateTime(localDateTimeString: string): string {
    if (localDateTimeString.length === 16) {
        return `${localDateTimeString}:00`;
    }
    return localDateTimeString;
}

// Hàm khởi tạo giá trị mặc định cho form
export function getInitialReservationFormData(
    initialData?: TableReservationResponse | null,
    defaultTableId?: string
): ReservationFormData {
    if (initialData) {
        return {
            tableId: initialData.tableId || "",
            customerName: initialData.customerName || "",
            customerPhone: initialData.customerPhone || "",
            guestCount: initialData.guestCount ?? 1,
            reservationTime: formatIsoToLocalInput(initialData.reservationTime),
            note: initialData.note || "",
        };
    }

    return {
        tableId: defaultTableId || "",
        customerName: "",
        customerPhone: "",
        guestCount: 2,
        reservationTime: formatIsoToLocalInput(),
        note: "",
    };
}