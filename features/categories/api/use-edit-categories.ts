import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';
type Request = InferRequestType<
  (typeof client.api.categories)[':id']['$patch']
>['json'];
type Response = InferResponseType<
  (typeof client.api.categories)[':id']['$patch']
>;

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, Request>({
    mutationFn: async (json) => {
      const response = await client.api.categories[':id'].$patch({
        json,
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({
        queryKey: ['category', id],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update category');
    },
  });
};
