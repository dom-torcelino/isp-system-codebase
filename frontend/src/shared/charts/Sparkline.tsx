import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[] | Array<{ value: number }>;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  height?: number;
}

export function Sparkline({
  data,
  color = 'var(--chart-1)',
  trend = 'neutral',
  height = 48,
}: SparklineProps) {
  // Convert number array to object array if needed
  const chartData = Array.isArray(data) && typeof data[0] === 'number'
    ? (data as number[]).map((value) => ({ value }))
    : (data as Array<{ value: number }>);

  const trendColors = {
    up: 'var(--chart-5)',
    down: 'var(--chart-4)',
    neutral: color,
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={trendColors[trend]}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
