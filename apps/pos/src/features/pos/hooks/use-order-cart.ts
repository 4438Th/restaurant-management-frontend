// apps/pos/src/features/pos/hooks/use-order-cart.ts

import { useMemo } from "react";
import { OrderItemStatus, type OrderItemResponse } from "@repo/shared-features/order";
import { type CartItem } from "../types";

export function useOrderCart(cart: CartItem[] = [], existingItems: OrderItemResponse[] = []) {
    // Tính tổng tiền món nháp
    const draftTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (Number(item.dish.price) || 0) * item.quantity, 0);
    }, [cart]);

    // Tính tổng tiền món đã gửi bếp
    const existingTotal = useMemo(() => {
        return existingItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    }, [existingItems]);

    const grandTotal = draftTotal + existingTotal;

    const totalItemCount = useMemo(() => {
        return (
            cart.reduce((sum, item) => sum + item.quantity, 0) +
            existingItems.reduce((sum, item) => sum + item.quantity, 0)
        );
    }, [cart, existingItems]);

    // RÀNG BUỘC THANH TOÁN: Toàn bộ món đã gửi chế biến phải ở trạng thái SERVED hoặc CANCELLED
    const isReadyForCheckout = useMemo(() => {
        if (existingItems.length === 0) return false;
        return existingItems.every(
            (item) =>
                item.status === OrderItemStatus.SERVED ||
                item.status === OrderItemStatus.CANCELLED
        );
    }, [existingItems]);

    return {
        draftTotal,
        existingTotal,
        grandTotal,
        totalItemCount,
        isReadyForCheckout,
    };
}