import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { z } from 'zod';
import { transactionsInsertSchema } from '@/db/schema';
const formSchema = transactionsInsertSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { TransactionForm } from './transaction-form';
import { useCreateTransaction } from '../api/use-create-transaction';
import { useCreateCategory } from '@/features/categories/api/use-create-categories';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Loader2 } from 'lucide-react';
export const NewTransactionSheet = () => {
  const { open, onClose } = useNewTransaction();
  const { mutate: createTransaction, isPending } =
    useCreateTransaction();
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();
  const { mutate: createAccount, isPending: isCreatingAccount } =
    useCreateAccount();
  const categories = useGetCategories();
  const onCreateCategory = (name: string) => {
    createCategory({ name });
  };
  const categoryOptions = (categories.data?.categories ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    })
  );

  const accounts = useGetAccounts();
  const onCreateAccount = (name: string) => {
    createAccount({ name });
  };
  const accountOptions = (accounts.data?.accounts ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    })
  );

  const onSubmit = (values: FormValues) => {
    createTransaction(values);
    onClose();
  };

  const isDisabled =
    isCreatingCategory || isCreatingAccount || isPending;

  const isLoading = isCreatingCategory || isCreatingAccount;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4 p-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Add a new transaction to your list of transactions
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isDisabled}
            categoryOptions={categoryOptions}
            accountOptions={accountOptions}
            onCreateCategory={onCreateCategory}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
