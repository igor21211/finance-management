import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.transactions)[':id']['$delete']
>;
type Response = InferResponseType<
  (typeof client.api.transactions)[':id']['$delete']
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async () => {
      const response = await client.api.transactions[':id'].$delete({
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Transaction deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transaction', id],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete transaction');
    },
  });
};
