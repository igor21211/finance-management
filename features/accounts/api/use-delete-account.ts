import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.accounts)[':id']['$delete']
>;
type Response = InferResponseType<
  (typeof client.api.accounts)[':id']['$delete']
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async () => {
      const response = await client.api.accounts[':id'].$delete({
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete account');
    },
  });
};
