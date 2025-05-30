import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  typeof client.api.categories.$post
>['json'];
type Response = InferResponseType<typeof client.api.categories.$post>;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({
        json,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create category');
    },
  });
};
