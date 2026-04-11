import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { formatValue } from './utils';

interface ColumnChartProps {
  data: any[];
  xKey?: string;
  bars?: Array<{
    key: string;
    color?: string;
    label?: string;
  }>;
  // New API (simplified)
  dataKeys?: string[];
  colors?: string[];
  stacked?: boolean;
  height?: number;
  unit?: 'currency' | 'percent' | 'count' | 'minutes' ;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function ColumnChart({
  data,
  xKey,
  bars,
  dataKeys,
  colors,
  stacked = false,
  height,
  unit = 'count',
  showLegend = true,
  showGrid = true,
}: ColumnChartProps) {
  // Support both old and new API
  const actualXKey = xKey || (data && data.length > 0 ? Object.keys(data[0])[0] : 'name');
  const actualBars = bars || (dataKeys || []).map((key, index) => ({
    key,
    color: colors?.[index],
    label: key,
  }));
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
    <ResponsiveContainer width="100%" height={height || '100%'}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.4}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={actualXKey}
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
        {actualBars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label || bar.key}
            fill={bar.color || chartColors[index % chartColors.length]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
