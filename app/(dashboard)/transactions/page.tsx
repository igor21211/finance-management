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
const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const transactions = useGetTransactions();
  const bulkDeleteTransactions = useBulkDeleteTransactions();
  const data = transactions.data?.transactions || [];

  const isDisabled =
    transactions.isLoading || bulkDeleteTransactions.isPending;

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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex  lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl line-clamp-1">
            Transactions
          </CardTitle>
          <Button onClick={newTransaction.onOpen}>
            <Plus className="size-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
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

export default TransactionsPage;
