import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>['json'];
type Response = InferResponseType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>;

export const useBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.accounts['bulk-delete'].$post(
        {
          json,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success('Accounts deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete accounts');
    },
  });
};
