import { useUpdateOrderItemStatus, OrderItemStatus } from '@repo/shared-features';
import { toast } from 'sonner';

export function useKitchenActions() {
    const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderItemStatus();

    const handleUpdateStatus = async (itemId: string, newStatus: OrderItemStatus, orderId?: string) => {
        try {
            await updateStatus({
                itemId,
                orderId,
                payload: { status: newStatus },
            });
            toast.success('Cập nhật trạng thái món thành công!');
        } catch {
            toast.error('Không thể cập nhật trạng thái món. Vui lòng thử lại!');
        }
    };

    return {
        handleUpdateStatus,
        isUpdating,
    };
}