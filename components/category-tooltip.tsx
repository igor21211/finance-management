import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
type Props = {
  active?: boolean;
  payload?:
    | {
        value: number;
        payload: { name: string };
      }[]
    | null;
};

export const CategoryTooltip = ({ active, payload }: Props) => {
  if (!active) return null;
  const name = payload?.[0]?.payload.name;
  const value = payload?.[0]?.value;
  return (
    <div className="bg-white p-2 rounded-sm border shadow-sm overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {name}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-red-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {value && formatCurrency(value * -1, false)}
          </p>
        </div>
      </div>
    </div>
  );
};
