import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './custom-tooltip';

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          tickLine={false}
          axisLine={false}
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), 'MMM d')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="income"
          fill="#3d82f6"
          className="drop-shadow-sm"
        />
        <Bar
          dataKey="expenses"
          fill="#f43f5e"
          className="drop-shadow-sm"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          style={{ fontSize: '12px' }}
          tickMargin={16}
          tickFormatter={(value) => `₴${value.toLocaleString()}`}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
