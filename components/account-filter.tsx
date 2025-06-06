'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import qs from 'query-string';
import { usePathname } from 'next/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSummary } from '@/features/summary/api/use-get-summary';

export const AccountFilter = () => {
  const { isLoading: isSummaryLoading } = useGetSummary();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId') || 'all';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const { data: accounts, isLoading } = useGetAccounts();

  const handleChange = (value: string) => {
    const query = {
      accountId: value,
      from,
      to,
    };
    if (value === 'all') {
      query.accountId = '';
    }
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  };
  return (
    <Select
      value={accountId}
      onValueChange={handleChange}
      disabled={isLoading || isSummaryLoading}
    >
      <SelectTrigger
        className="lg:w-auto text-white w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 
      hover:text-white border-none  focus:ring-offset-0 focus:ring-transparent outline-none focus:bg-white/30 transition"
      >
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {accounts?.accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
