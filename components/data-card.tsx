import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { IconType } from 'react-icons';
import { cva } from 'class-variance-authority';
import { CountUp } from './count-up';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';

const bodyVariants = cva('p-3 rounded-md', {
  variants: {
    variant: {
      default: 'bg-blue-500/20',
      success: 'bg-emerald-500/20',
      danger: 'bg-rose-500/20',
      warning: 'bg-yellow-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const iconVariants = cva('size-6', {
  variants: {
    variant: {
      default: 'fill-blue-500',
      success: 'fill-emerald-500',
      danger: 'fill-rose-500',
      warning: 'fill-yellow-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BoxVariant = VariantProps<typeof bodyVariants>;
type IconVariant = VariantProps<typeof iconVariants>;

interface DataCardProps extends BoxVariant, IconVariant {
  title: string;
  value?: number;
  percentageChange?: number;
  icon: IconType;
  dateRange: string;
}
export const DataCard = ({
  title,
  value = 0,
  percentageChange = 0,
  icon: Icon,
  variant,
  dateRange,
}: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-2">
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn('shrink-0', bodyVariants({ variant }))}>
          <Icon className={cn(iconVariants({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold mb-2 line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={(value) => formatCurrency(value, false)}
          />
        </h1>
        <p
          className={cn(
            'text-muted-foreground text-sm line-clamp-1',
            percentageChange > 0 && 'text-emerald-500',
            percentageChange < 0 && 'text-rose-500'
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })}{' '}
          from last period
        </p>
      </CardContent>
    </Card>
  );
};
