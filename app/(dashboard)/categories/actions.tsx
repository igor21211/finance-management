'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteCategory } from '@/features/categories/api/use-delete-categories';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenCategory();
  const { mutate: deleteCategory, isPending } = useDeleteCategory(id);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this category?',
    'This action cannot be undone.'
  );

  const handleDelete = () => {
    deleteCategory({ param: { id } });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onOpen(id)}>
            <Edit className="size-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const confirmed = await confirm();
              if (confirmed) {
                handleDelete();
              }
            }}
            disabled={isPending}
          >
            <Trash className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};
