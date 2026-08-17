import type { TableReservationResponse } from "@repo/shared-features/reservations";
import type { ReservationFormData } from "../types";

export function formatIsoToLocalInput(isoString?: string): string {
    if (!isoString) {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }
    return isoString.slice(0, 16);
}

export function formatLocalInputToLocalDateTime(localDateTimeString: string): string {
    if (localDateTimeString.length === 16) {
        return `${localDateTimeString}:00`;
    }
    return localDateTimeString;
}

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