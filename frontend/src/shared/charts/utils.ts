export function formatValue(
  value: number,
  unit: 'currency' | 'percent' | 'count' | 'minutes' = 'count',
  compact: boolean = false
): string {
  switch (unit) {
    case 'currency':
      if (compact) {
        if (value >= 1000000000) return `₱${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `₱${(value / 1000).toFixed(1)}K`;
      }
      return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    case 'percent':
      return `${value.toFixed(1)}%`;
    
    case 'minutes':
      if (compact) {
        if (value >= 60) return `${(value / 60).toFixed(1)}h`;
      }
      return `${value.toLocaleString()} min`;
    
    case 'count':
    default:
      if (compact) {
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
  }
}

export function calculateDelta(current: number, previous: number): {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
} {
  const delta = current - previous;
  const percentage = previous === 0 ? 0 : (delta / previous) * 100;
  
  return {
    value: delta,
    percentage,
    direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral',
  };
}
