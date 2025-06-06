'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useState, Suspense } from 'react';
import UploadButton from './upload-button';
import ImportCard from './import-card';
import { transactions as transactionSchema } from '@/db/schema';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { toast } from 'sonner';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPageContent = () => {
  const [AccountSelectDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<
    typeof INITIAL_IMPORT_RESULTS
  >(INITIAL_IMPORT_RESULTS);
  const newTransaction = useNewTransaction();
  const bulkCreateTransactions = useBulkCreateTransactions();
  const transactions = useGetTransactions();
  const bulkDeleteTransactions = useBulkDeleteTransactions();
  const data = transactions.data?.transactions || [];
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const isDisabled =
    transactions.isLoading || bulkDeleteTransactions.isPending;

  const onSubmitImport = (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    bulkCreateTransactions.mutate(values, {
      onSuccess: () => {
        toast.success('Transactions imported successfully');
        onCancelImport();
      },
      onError: () => {
        toast.error('Failed to import transactions');
      },
    });
  };

  const handleImport = async (
    data: {
      date: string;
      amount: number;
      payee: string;
      notes?: string;
      categoryId?: string;
    }[]
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error('Account not selected');
    }
    const transformedData = data.map((item) => ({
      ...item,
      date: new Date(item.date),
      id: crypto.randomUUID(),
      accountId: accountId as string,
    }));
    onSubmitImport(transformedData);
  };

  if (transactions.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountSelectDialog />
        <ImportCard
          onCancel={onCancelImport}
          onSubmit={handleImport}
          data={importResults.data}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl line-clamp-1">
            Transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={newTransaction.onOpen}
            >
              <Plus className="size-4 mr-2" />
              Add Transaction
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="category"
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const TransactionsPage = () => {
  return (
    <Suspense>
      <TransactionsPageContent />
    </Suspense>
  );
};

export default TransactionsPage;
