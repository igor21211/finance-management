'use client';

import { JSX, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetAccounts } from '../api/use-get-accounts';
import { useCreateAccount } from '../api/use-create-account';
import { Select } from '@/components/select';

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>,
] => {
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string>('');

  const accounts = useGetAccounts();
  const { mutate: createAccount, isPending: isCreatingAccount } =
    useCreateAccount();
  const onCreateAccount = (name: string) => {
    createAccount({ name });
  };
  const accountOptions = (accounts.data?.accounts ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    })
  );
  const confirm = () =>
    new Promise((resolve) => setPromise({ resolve }));
  const handleClose = () => setPromise(null);
  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };
  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };
  const SelectAccountDialog = () => (
    <Dialog open={!!promise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Select an account to continue
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => {
            selectValue.current = value;
          }}
          disabled={isCreatingAccount || accounts.isLoading}
        />
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return [SelectAccountDialog, confirm];
};
