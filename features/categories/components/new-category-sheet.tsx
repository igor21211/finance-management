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

import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { CategoryForm } from './category-form';
import { useCreateCategory } from '../api/use-create-categories';
export const NewCategorySheet = () => {
  const { open, onClose } = useNewCategory();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    createCategory(values);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4 p-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Add a new category to your list of categories
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          onDelete={() => {}}
          disabled={isPending}
          defaultValues={{
            name: '',
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
