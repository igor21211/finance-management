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

import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { AccountForm } from './account-form';
import { useCreateAccount } from '../api/use-create-account';
export const NewAccountSheet = () => {
  const { open, onClose } = useNewAccount();
  const { mutate: createAccount, isPending } = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    createAccount(values);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4 p-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Add a new account to your list of accounts
          </SheetDescription>
        </SheetHeader>
        <AccountForm
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
