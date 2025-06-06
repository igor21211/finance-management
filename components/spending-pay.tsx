import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileSearch, PieChart, Radar, Target } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PieVariant from './pie-variant';
import RadarVariant from './radar-variant';
import RadialVariant from './radial-variant';
import { Skeleton } from './ui/skeleton';
type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export default function SpendingPay({ data = [] }: Props) {
  const [variant, setVariant] = useState<'pie' | 'radar' | 'radial'>(
    'pie'
  );
  const onTypeChange = (type: 'pie' | 'radar' | 'radial') => {
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
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Radial Chart</p>
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
            {variant === 'pie' && <PieVariant data={data} />}
            {variant === 'radar' && <RadarVariant data={data} />}
            {variant === 'radial' && <RadialVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export const SpendingPaySkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[350px] w-full">
      <Skeleton className="size-6 text-muted-foreground" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
    </div>
  );
};
