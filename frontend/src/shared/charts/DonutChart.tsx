import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatValue } from './utils';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  unit?: 'currency' | 'percent' | 'count' | 'minutes';
  centerLabel?: string;
  centerSubtitle?: string;
  variant?: 'default' | 'ring';
}

export function DonutChart({
  data,
  unit = 'count',
  centerLabel,
  centerSubtitle,
  variant = 'default',
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
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

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const activeData = activeIndex !== null ? data[activeIndex] : null;

  const displayValue = activeData
    ? formatValue(activeData.value, unit)
    : centerLabel || formatValue(total, unit);
  
  const displaySubtitle = activeData
    ? `${((activeData.value / total) * 100).toFixed(1)}% of total`
    : centerSubtitle || `Total ${unit}`;

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={variant === 'ring' ? '70%' : '60%'}
            outerRadius="80%"
            paddingAngle={variant === 'ring' ? 4 : 0}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || chartColors[index % chartColors.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover border border-border rounded-md shadow-lg p-3">
                    <p className="font-medium text-foreground">{payload[0].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatValue(payload[0].value as number, unit)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((payload[0].value as number / total) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {displayValue}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            {displaySubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
