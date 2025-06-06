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

import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { TransactionForm } from './transaction-form';
import { useGetTransaction } from '../api/use-get-transaction';
import { Loader2 } from 'lucide-react';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { useConfirm } from '@/hooks/use-confirm';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useCreateCategory } from '@/features/categories/api/use-create-categories';
import { convertAmountFromMiliUnits } from '@/lib/utils';

export const EditTransactionSheet = () => {
  const { open, onClose, id } = useOpenTransaction();
  const { data: transaction, isLoading } = useGetTransaction(id!);
  const { mutate: editTransaction, isPending } = useEditTransaction(
    id!
  );

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

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this transaction?',
    'This action cannot be undone.'
  );
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction(id!);

  const onSubmit = (values: FormValues) => {
    editTransaction(
      {
        date: values.date,
        amount: values.amount,
        payee: values.payee,
        accountId: values.accountId,
        notes: values.notes,
        categoryId: values.categoryId,
      },
      { onSuccess: () => onClose() }
    );
  };

  const defaultValues = transaction?.transaction
    ? {
        date: transaction.transaction.date
          ? new Date(transaction.transaction.date)
          : new Date(),
        accountId: transaction.transaction.accountId,
        amount: convertAmountFromMiliUnits(
          transaction.transaction.amount
        ).toString(),
        payee: transaction.transaction.payee,
        notes: transaction.transaction.notes,
        categoryId: transaction.transaction.categoryId,
      }
    : {
        date: new Date(),
        accountId: '',
        amount: '',
        payee: '',
        notes: '',
        categoryId: '',
      };
  console.log(defaultValues);

  const onDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteTransaction(
        { param: { id } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const isDisabled =
    isLoading ||
    isPending ||
    isDeleting ||
    isCreatingAccount ||
    isCreatingCategory;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="space-y-4 p-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit the transaction details
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id!}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isDisabled}
              defaultValues={defaultValues}
              accountOptions={accountOptions}
              categoryOptions={categoryOptions}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDialog />
    </>
  );
};
