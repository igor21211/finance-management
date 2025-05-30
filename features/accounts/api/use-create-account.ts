import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  typeof client.api.accounts.$post
>['json'];
type Response = InferResponseType<typeof client.api.accounts.$post>;

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({
        json,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create account');
    },
  });
};
