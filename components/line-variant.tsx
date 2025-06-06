import { format } from 'date-fns';
import {
  LineChart,
  Line,
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

export const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
        <Line
          dot={false}
          dataKey="income"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dot={false}
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          style={{ fontSize: '12px' }}
          tickMargin={16}
          tickFormatter={(value) => `₴${value.toLocaleString()}`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
