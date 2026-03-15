import { formatValue } from './utils';

interface EnhancedTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: 'currency' | 'percent' | 'count' | 'minutes';
  showDelta?: boolean;
  showPercentOfTotal?: boolean;
  total?: number;
  previousData?: any;
}

export function EnhancedTooltip({
  active,
  payload,
  label,
  unit = 'count',
  showDelta = false,
  showPercentOfTotal = false,
  total,
  previousData,
}: EnhancedTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const calculateDelta = (current: number, previous: number) => {
    const delta = current - previous;
    const percentChange = previous !== 0 ? ((delta / previous) * 100).toFixed(1) : '0.0';
    return { delta, percentChange };
  };

  return (
    <div className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
      {label && (
        <p className="font-medium text-foreground mb-2 pb-2 border-b border-border">
          {label}
        </p>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const value = entry.value as number;
          const previousValue = previousData?.[entry.dataKey];
          const showDeltaForThis = showDelta && previousValue !== undefined;
          const delta = showDeltaForThis ? calculateDelta(value, previousValue) : null;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {formatValue(value, unit)}
                </span>
              </div>
              
              {/* Delta indicator */}
              {delta && (
                <div className="flex items-center gap-1 text-xs pl-5">
                  <span className={delta.delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {delta.delta >= 0 ? '▲' : '▼'} {delta.percentChange}%
                  </span>
                  <span className="text-muted-foreground">vs previous</span>
                </div>
              )}
              
              {/* Percent of total */}
              {showPercentOfTotal && total && (
                <div className="text-xs text-muted-foreground pl-5">
                  {((value / total) * 100).toFixed(1)}% of total
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
