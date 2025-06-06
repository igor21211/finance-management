import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { CustomTooltip } from './custom-tooltip';
type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export default function AreaVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          tickLine={false}
          axisLine={false}
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), 'MMM d')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#3d82f6"
          strokeWidth={2}
          stackId="income"
          fill="url(#income)"
          name="Income"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          stackId="expenses"
          fill="url(#expenses)"
          name="Expenses"
          className="drop-shadow-sm"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          style={{ fontSize: '12px' }}
          tickMargin={16}
          tickFormatter={(value) => `₴${value.toLocaleString()}`}
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}
