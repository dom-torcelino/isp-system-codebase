import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatValue } from './utils';

interface AreaChartProps {
  data: any[];
  xKey: string;
  areas: Array<{
    key: string;
    color?: string;
    label?: string;
  }>;
  unit?: 'currency' | 'percent' | 'count' | 'minutes';
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
}

export function AreaChart({
  data,
  xKey,
  areas,
  unit = 'count',
  showLegend = true,
  showGrid = true,
  stacked = false,
}: AreaChartProps) {
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
      <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
            iconType="rect"
          />
        )}
        {areas.map((area, index) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.label || area.key}
            stroke={area.color || chartColors[index % chartColors.length]}
            fill={area.color || chartColors[index % chartColors.length]}
            fillOpacity={0.2}
            strokeWidth={2}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
