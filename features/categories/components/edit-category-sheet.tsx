import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { z } from 'zod';
import { categoriesInsertSchema } from '@/db/schema';
const formSchema = categoriesInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

import { Loader2 } from 'lucide-react';

import { useConfirm } from '@/hooks/use-confirm';
import { useOpenCategory } from '../hooks/use-open-category';
import { useGetCategory } from '../api/use-get-category';
import { useEditCategory } from '../api/use-edit-categories';
import { useDeleteCategory } from '../api/use-delete-categories';
import { CategoryForm } from './category-form';
export const EditCategorySheet = () => {
  const { open, onClose, id } = useOpenCategory();
  const { data: category, isLoading } = useGetCategory(id!);
  const { mutate: editCategory, isPending } = useEditCategory(id!);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this category?',
    'This action cannot be undone.'
  );
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategory(id!);

  const onSubmit = (values: FormValues) => {
    editCategory(
      { name: values.name },
      { onSuccess: () => onClose() }
    );
  };

  const isDisabled = isLoading || isPending || isDeleting;

  const defaultValues = category?.category
    ? {
        name: category.category.name,
      }
    : {
        name: '',
      };
  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="space-y-4 p-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit the account details
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          ) : (
            <CategoryForm
              id={id!}
              onSubmit={onSubmit}
              onDelete={async () => {
                const confirmed = await confirm();
                if (confirmed) {
                  deleteCategory(
                    { param: { id } },
                    {
                      onSuccess: () => {
                        onClose();
                      },
                    }
                  );
                }
              }}
              disabled={isDisabled}
              defaultValues={defaultValues}
              onClose={onClose}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </>
  );
};
