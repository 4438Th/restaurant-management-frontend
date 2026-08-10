import { useState } from 'react';
import { OrderItemStatus } from '@repo/shared-features';

export function useKitchenFilters() {
    const [selectedStatus, setSelectedStatus] = useState<OrderItemStatus | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');

    return {
        selectedStatus,
        setSelectedStatus,
        searchTerm,
        setSearchTerm,
    };
}