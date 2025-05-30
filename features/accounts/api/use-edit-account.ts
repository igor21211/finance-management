import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.accounts)[':id']['$patch']
>['json'];
type Response = InferResponseType<
  (typeof client.api.accounts)[':id']['$patch']
>;

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[':id'].$patch({
        json,
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Account updated successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({
        queryKey: ['account', id],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update account');
    },
  });
};
