import { useState, useEffect } from "react";
import {
    useReservation,
    TableReservationStatus,
    type TableReservationFilterParams,
    type TableReservationResponse
} from "@repo/shared-features/reservations";
import { type CursorPageResponse } from "@repo/core";

export function useFilters() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [filters, setFilters] = useState<TableReservationFilterParams>({});

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters({
                cursor: undefined,
                size: 10,
                search: searchQuery.trim() || undefined,
                status: selectedStatus === "ALL" ? undefined : (selectedStatus as TableReservationStatus),
            });
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, selectedStatus]);

    const { data, ...rest } = useReservation(filters);
    const pageData = data as unknown as CursorPageResponse<TableReservationResponse> | undefined;

    const loadNextPage = () => {
        if (pageData?.hasNext && pageData?.nextCursor) {
            setFilters(prev => ({ ...prev, cursor: pageData.nextCursor }));
        }
    };

    const resetCursor = () => setFilters(prev => ({ ...prev, cursor: undefined }));

    return {
        pageData,
        reservations: pageData?.data || [],
        filters,
        searchQuery, setSearchQuery,
        selectedStatus, setSelectedStatus,
        loadNextPage, resetCursor, ...rest
    };
}