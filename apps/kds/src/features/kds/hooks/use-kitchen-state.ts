import { useState } from 'react';
import { type OrderItemResponse } from '@repo/shared-features';

export function useKitchenState() {
    const [selectedItem, setSelectedItem] = useState<OrderItemResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const openDetailModal = (item: OrderItemResponse) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedItem(null);
        setIsDetailModalOpen(false);
    };

    return {
        selectedItem,
        isDetailModalOpen,
        openDetailModal,
        closeDetailModal,
    };
}