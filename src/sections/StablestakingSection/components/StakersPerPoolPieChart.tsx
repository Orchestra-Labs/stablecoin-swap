import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { Spinner } from '@/assets/icons';
import { useGetTotalStakers } from '@/sections';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#8884d8"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const StakersPerPoolPieChart = () => {
  const { data: totalStakers, isLoading } = useGetTotalStakers();
  const hasData = totalStakers?.stakers && totalStakers.stakers.length > 0;

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Spinner className="w-10 h-10 animate-spin fill-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-[240px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        {hasData ? (
          <PieChart>
            <Pie
              data={totalStakers.stakers}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="denom"
            >
              {totalStakers.stakers.map((entry, index) => (
                <Cell
                  key={`cell-${entry.denom}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={value => [`${value} stakers`]} />
            <Legend
              formatter={value => value}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">
                No staking data available
              </div>
              <div className="text-sm">
                Stake tokens to see the distribution
              </div>
            </div>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};
