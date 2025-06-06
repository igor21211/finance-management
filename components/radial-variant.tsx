import { formatCurrency } from '@/lib/utils';
import {
  RadialBar,
  RadialBarChart,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryTooltip } from './category-tooltip';

const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function RadialVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="30%"
        barSize={10}
        innerRadius="90%"
        outerRadius="40%"
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontSize: 12,
          }}
          dataKey="value"
          fill="#8884d8"
          background={{ fill: '#383838' }}
          cornerRadius={10}
        />
        <Legend
          layout="horizontal"
          align="right"
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={10}
          content={({ payload }) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload?.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor: entry.color,
                      }}
                    />
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(entry.payload?.value, false)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
