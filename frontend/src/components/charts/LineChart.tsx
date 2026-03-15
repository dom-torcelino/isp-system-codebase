import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatValue } from './utils';

interface LineChartProps {
  data: any[];
  xKey: string;
  lines: Array<{
    key: string;
    color?: string;
    label?: string;
  }>;
  unit?: 'currency' | 'percent' | 'count' | 'minutes';
  showLegend?: boolean;
  showGrid?: boolean;
}

export function LineChart({
  data,
  xKey,
  lines,
  unit = 'count',
  showLegend = true,
  showGrid = true,
}: LineChartProps) {
  const chartColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
    'var(--chart-7)',
    'var(--chart-8)',
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.4}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          tickLine={{ stroke: 'var(--border)' }}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          tickLine={{ stroke: 'var(--border)' }}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={(value) => formatValue(value, unit, true)}
        />
        <Tooltip content={<ChartTooltip unit={unit} />} />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 14, color: 'var(--text-muted)' }}
            iconType="line"
          />
        )}
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label || line.key}
            stroke={line.color || chartColors[index % chartColors.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
