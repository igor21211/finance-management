'use client';

import { Button } from '@/components/ui/button';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';
type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenAccount();
  const { mutate: deleteAccount, isPending } = useDeleteAccount(id);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this account?',
    'This action cannot be undone.'
  );

  const handleDelete = () => {
    deleteAccount({ param: { id } });
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
