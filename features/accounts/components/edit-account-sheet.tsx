import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { z } from 'zod';
import { accountsInsertSchema } from '@/db/schema';
const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { AccountForm } from './account-form';
import { useGetAccount } from '../api/use-get-account';
import { Loader2 } from 'lucide-react';
import { useEditAccount } from '../api/use-edit-account';
import { useDeleteAccount } from '../api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';
export const EditAccountSheet = () => {
  const { open, onClose, id } = useOpenAccount();
  const { data: account, isLoading } = useGetAccount(id!);
  const { mutate: editAccount, isPending } = useEditAccount(id!);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this account?',
    'This action cannot be undone.'
  );
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteAccount(id!);

  const onSubmit = (values: FormValues) => {
    editAccount(
      { name: values.name },
      { onSuccess: () => onClose() }
    );
  };

  const isDisabled = isLoading || isPending || isDeleting;

  const defaultValues = account?.account
    ? {
        name: account.account.name,
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
            <AccountForm
              id={id!}
              onSubmit={onSubmit}
              onDelete={async () => {
                const confirmed = await confirm();
                if (confirmed) {
                  deleteAccount(
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
