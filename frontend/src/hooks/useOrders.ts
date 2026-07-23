import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, getMyOrders, getOrderById } from '../lib/api/orders';
import { useRouter } from 'next/navigation';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Clear cart or handle success (could redirect to order confirmation)
      // router.push(`/order-confirmation/${data.data._id}`); 
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'me'],
    queryFn: getMyOrders,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};
