import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart,
  BarChart,
  FileSearch,
  LineChart,
} from 'lucide-react';
import AreaVariant from './area-variant';
import { BarVariant } from './bar-variant copy';
import { LineVariant } from './line-variant';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from './ui/skeleton';
type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export default function Chart({ data = [] }: Props) {
  const [variant, setVariant] = useState<'area' | 'bar' | 'line'>(
    'area'
  );
  const onTypeChange = (type: 'area' | 'bar' | 'line') => {
    //add: paywall
    setVariant(type);
  };
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex  space-y-2 lg:flex-row lg:items-center lg:space-y-0 justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transactions
        </CardTitle>
        <Select onValueChange={onTypeChange} defaultValue={variant}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Select a variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No transactions found
            </p>
          </div>
        ) : (
          <>
            {variant === 'area' && <AreaVariant data={data} />}
            {variant === 'bar' && <BarVariant data={data} />}
            {variant === 'line' && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export const ChartSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[350px] w-full">
      <Skeleton className="size-6 text-muted-foreground" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
    </div>
  );
};
