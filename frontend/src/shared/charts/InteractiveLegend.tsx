import { useState } from 'react';
import { Badge } from '../ui/badge';

interface LegendItem {
  key: string;
  label: string;
  color: string;
}

interface InteractiveLegendProps {
  items: LegendItem[];
  onToggle?: (key: string, visible: boolean) => void;
  onIsolate?: (key: string) => void;
  visibleKeys?: Set<string>;
}

export function InteractiveLegend({
  items,
  onToggle,
  onIsolate,
  visibleKeys = new Set(items.map(item => item.key)),
}: InteractiveLegendProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      {items.map((item) => {
        const isVisible = visibleKeys.has(item.key);
        return (
          <button
            key={item.key}
            onClick={() => onToggle?.(item.key, !isVisible)}
            onDoubleClick={() => onIsolate?.(item.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              isVisible
                ? 'bg-muted/50 hover:bg-muted'
                : 'bg-muted/20 opacity-40 hover:opacity-60'
            }`}
            title="Click to toggle, double-click to isolate"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-foreground">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
