import { formatPercentage } from '@/lib/utils';
import {
  Cell,
  Pie,
  PieChart,
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

type LegendEntry = {
  value: string;
  color: string;
  payload: {
    name: string;
    value: number;
    percent: number;
  };
};

export default function PieVariant({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
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
                {(payload as unknown as LegendEntry[])?.map(
                  (entry, index) => (
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
                          {formatPercentage(
                            entry.payload.percent * 100
                          )}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            );
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
