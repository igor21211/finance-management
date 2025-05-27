import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.categories)[':id']['$delete']
>;
type Response = InferResponseType<
  (typeof client.api.categories)[':id']['$delete']
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async () => {
      const response = await client.api.categories[':id'].$delete({
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete category');
    },
  });
};
