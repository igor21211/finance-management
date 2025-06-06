import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
type Props = {
  active?: boolean;
  payload?:
    | {
        value: number;
        payload: { date: string };
      }[]
    | null;
};

export const CustomTooltip = ({ active, payload }: Props) => {
  if (!active) return null;
  const date = payload?.[0]?.payload.date;
  const income = payload?.[0]?.value;
  const expenses = payload?.[1]?.value;
  return (
    <div className="bg-white p-2 rounded-sm border shadow-sm overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {date && format(date, 'MMM d, yyyy')}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-blue-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-sm text-right font-medium">
            {income && formatCurrency(income, false)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-red-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {expenses && formatCurrency(expenses, false)}
          </p>
        </div>
      </div>
    </div>
  );
};
