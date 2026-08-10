import { useState as useReactState } from "react";
import { type TableReservationResponse } from "@repo/shared-features/reservations";

export function useReservationState() {
    const [isFormOpen, setIsFormOpen] = useReactState<boolean>(false);
    const [editingItem, setEditingItem] = useReactState<TableReservationResponse | null>(null);
    const [cancelModalItem, setCancelModalItem] = useReactState<TableReservationResponse | null>(null);
    const [cancelReason, setCancelReason] = useReactState<string>("");

    return {
        isFormOpen,
        setIsFormOpen,
        editingItem,
        setEditingItem,
        cancelModalItem,
        setCancelModalItem,
        cancelReason,
        setCancelReason,
    };
}