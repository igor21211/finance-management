import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
type Props = {
  account: string;
  accountId: string;
};

const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: openAccount } = useOpenAccount();

  const handleOpenAccount = () => {
    if (accountId) {
      openAccount(accountId);
    }
  };

  return (
    <div
      className="flex items-center cursor-pointer hover:underline"
      onClick={handleOpenAccount}
    >
      {account}
    </div>
  );
};

export { AccountColumn };
