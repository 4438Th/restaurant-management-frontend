import { usePosStore, type PosState } from './use-pos-store';
import type { CartItem } from '@/features/pos';

export const usePosCalculations = () => {
    const cart = usePosStore((state: PosState) => state.cart);
    const discountPercentage = usePosStore(
        (state: PosState) => state.discountPercentage
    );

    const subtotal = cart.reduce((sum: number, item: CartItem) => {
        const priceNum = parseFloat(item.dish.price) || 0;
        return sum + priceNum * item.quantity;
    }, 0);

    const totalItems = cart.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
    );
    const discountAmount = (subtotal * discountPercentage) / 100;
    const grandTotal = subtotal - discountAmount;

    return {
        subtotal,
        totalItems,
        discountAmount,
        grandTotal,
    };
};