import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from './ui/utils';
import { Sparkline } from './charts/Sparkline';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  sparklineData?: number[];
  onClick?: () => void;
}

export function KPICard({ title, value, change, trend, sparklineData, onClick }: KPICardProps) {
  return (
    <Card
      className={cn(
        'p-4 hover:shadow-md transition-all duration-200 border-border',
        onClick && 'cursor-pointer hover:border-primary/30'
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {change && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
              )}
            >
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        {sparklineData && (
          <div className="h-8 -mx-1 mt-1">
            <Sparkline
              data={sparklineData}
              color={trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#4f46e5'}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
