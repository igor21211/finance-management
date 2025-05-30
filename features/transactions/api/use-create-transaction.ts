import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  typeof client.api.transactions.$post
>['json'];
type Response = InferResponseType<typeof client.api.transactions.$post>;

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({
        json,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Transaction created successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create transaction');
    },
  });
};
