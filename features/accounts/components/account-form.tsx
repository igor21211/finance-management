'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { accountsInsertSchema } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash } from 'lucide-react';
const formSchema = accountsInsertSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  onClose?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="eg. Cash, Bank, Credit Card"
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
