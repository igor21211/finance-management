import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen } = useOpenTransaction();
  const { onOpen: openCategory } = useOpenCategory();

  const handleOpenCategory = () => {
    if (categoryId) {
      openCategory(categoryId);
    } else {
      onOpen(id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center cursor-pointer hover:underline',
        !category && 'text-rose-500'
      )}
      onClick={handleOpenCategory}
    >
      {!category && <TriangleAlert className="size-4 mr-2" />}
      {category || 'No category'}
    </div>
  );
};

export { CategoryColumn };
