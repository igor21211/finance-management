'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDelete } from '@/features/accounts/api/use-bulk-delete-accounts';
import { Suspense } from 'react';

const AccountsPageContent = () => {
  const newAccount = useNewAccount();
  const accounts = useGetAccounts();
  const bulkDeleteAccounts = useBulkDelete();
  const data = accounts.data?.accounts || [];

  const isDisabled =
    accounts.isLoading || bulkDeleteAccounts.isPending;

  if (accounts.isLoading) {
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
            Accounts
          </CardTitle>
          <Button onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const AccountsPage = () => {
  return (
    <Suspense>
      <AccountsPageContent />
    </Suspense>
  );
};

export default AccountsPage;
