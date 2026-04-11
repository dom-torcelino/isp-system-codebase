import { formatValue } from './utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: 'currency' | 'percent' | 'count' | 'minutes';
}

export function ChartTooltip({ active, payload, label, unit = 'count' }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg p-3 min-w-[200px]">
      {label && (
        <p className="font-medium text-foreground mb-2 pb-2 border-b border-border">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatValue(entry.value, unit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
