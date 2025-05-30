import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.categories)['bulk-delete']['$post']
>['json'];
type Response = InferResponseType<
  (typeof client.api.categories)['bulk-delete']['$post']
>;

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.categories[
        'bulk-delete'
      ].$post({
        json,
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Categories deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete categories');
    },
  });
};
