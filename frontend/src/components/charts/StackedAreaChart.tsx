import { useState } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { EnhancedTooltip } from './EnhancedTooltip';
import { InteractiveLegend } from './InteractiveLegend';
import { formatValue } from './utils';

interface StackedAreaChartProps {
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
  onClick?: (dataKey: string, data: any) => void;
}

export function StackedAreaChart({
  data,
  xKey,
  areas,
  unit = 'count',
  showLegend = true,
  showGrid = true,
  onClick,
}: StackedAreaChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
    new Set(areas.map((a) => a.key))
  );

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
  ];

  const legendItems = areas.map((area, index) => ({
    key: area.key,
    label: area.label || area.key,
    color: area.color || chartColors[index % chartColors.length],
  }));

  const handleToggle = (key: string, visible: boolean) => {
    const newVisible = new Set(visibleSeries);
    if (visible) {
      newVisible.add(key);
    } else {
      newVisible.delete(key);
    }
    setVisibleSeries(newVisible);
  };

  const handleIsolate = (key: string) => {
    setVisibleSeries(new Set([key]));
  };

  const handleAreaClick = (data: any, dataKey: string) => {
    onClick?.(dataKey, data);
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.32}
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
          <Tooltip content={<EnhancedTooltip unit={unit} />} />
          {areas.map((area, index) => {
            const isVisible = visibleSeries.has(area.key);
            if (!isVisible) return null;
            
            return (
              <Area
                key={area.key}
                type="monotone"
                dataKey={area.key}
                name={area.label || area.key}
                stroke={area.color || chartColors[index % chartColors.length]}
                fill={area.color || chartColors[index % chartColors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                stackId="stack"
                onClick={(data) => handleAreaClick(data, area.key)}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
                animationDuration={220}
                animationEasing="ease-out"
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>

      {showLegend && (
        <InteractiveLegend
          items={legendItems}
          visibleKeys={visibleSeries}
          onToggle={handleToggle}
          onIsolate={handleIsolate}
        />
      )}
    </div>
  );
}
