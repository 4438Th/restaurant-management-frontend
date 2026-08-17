import { useState } from 'react';
import type { DishResponse } from '@repo/shared-features/menu';
import type { TableReservationResponse } from '@repo/shared-features/reservations';
import type { ReservationFormData, PreOrderItem } from '../types';
import { getInitialReservationFormData } from '../utils/reservation-form.utils';

export function useReservationState() {
    // Modal visibility & Items selected for Modals
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<TableReservationResponse | null>(null);
    const [detailItem, setDetailItem] = useState<TableReservationResponse | null>(null);
    const [cancelModalItem, setCancelModalItem] = useState<TableReservationResponse | null>(null);
    const [depositModalItem, setDepositModalItem] = useState<TableReservationResponse | null>(null);
    const [cancelReason, setCancelReason] = useState<string>('');

    // Form & Wizard State (Phục vụ Pure UI Modal)
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState<ReservationFormData>(() => getInitialReservationFormData());
    const [preOrderItems, setPreOrderItems] = useState<PreOrderItem[]>([]);

    // ---- Form State Handlers ----
    const handleFormChange = (field: keyof ReservationFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddToCart = (dish: DishResponse) => {
        setPreOrderItems((prev) => {
            const existing = prev.find((item) => item.dish.id === dish.id);
            if (existing) {
                return prev.map((item) =>
                    item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { dish, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (dishId: string, delta: number) => {
        setPreOrderItems((prev) =>
            prev
                .map((item) => {
                    if (item.dish.id === dishId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as PreOrderItem[]
        );
    };

    const handleRemoveItem = (dishId: string) => {
        setPreOrderItems((prev) => prev.filter((item) => item.dish.id !== dishId));
    };

    // ---- Modal Helpers ----
    const openCreateModal = (defaultTableId?: string) => {
        setEditingItem(null);
        setFormData(getInitialReservationFormData(null, defaultTableId));
        setPreOrderItems([]);
        setCurrentStep(1);
        setIsFormOpen(true);
    };

    const openEditModal = (item: TableReservationResponse) => {
        setEditingItem(item);
        setFormData(getInitialReservationFormData(item));
        setPreOrderItems([]); // Nếu Backend có món pre-order cũ, map ở đây
        setCurrentStep(1);
        setIsFormOpen(true);
    };

    const closeFormModal = () => {
        setIsFormOpen(false);
        setEditingItem(null);
        setCurrentStep(1);
        setPreOrderItems([]);
    };

    return {
        // States
        isFormOpen,
        editingItem,
        detailItem,
        cancelModalItem,
        depositModalItem,
        cancelReason,
        currentStep,
        formData,
        preOrderItems,

        // State Setters
        setIsFormOpen,
        setEditingItem,
        setDetailItem,
        setCancelModalItem,
        setDepositModalItem,
        setCancelReason,
        setCurrentStep,

        // Form & Cart Actions
        handleFormChange,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveItem,

        // Helper Modal Controls
        openCreateModal,
        openEditModal,
        closeFormModal,
    };
}