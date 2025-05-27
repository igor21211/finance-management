'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Select } from '@/components/select';
import { transactionsInsertSchema } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash } from 'lucide-react';
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.number(),
  notes: z.string().nullable().optional(),
});

const apiSchema = transactionsInsertSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);
    //onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onCreate={onCreateAccount}
                />
              </FormControl>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onCreate={onCreateCategory}
                />
              </FormControl>
            </FormItem>
          )}
        />


        <Button className="w-full" type="submit" disabled={disabled}>
          {id ? 'Update' : 'Create'}
        </Button>
        {!!id && (
          <Button
            type="button"
            className="w-full"
            variant="destructive"
            disabled={disabled}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </Button>
        )}
      </form>
    </Form>
  );
};
