import { ReactNode } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Info, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ChartCardProps {
  title: string;
  timeframe?: string;
  info?: string;
  onViewModule?: () => void;
  onExport?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  timeframe,
  info,
  onViewModule,
  onExport,
  children,
  footer,
  className = '',
}: ChartCardProps) {
  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-foreground">{title}</h3>
          {timeframe && (
            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
              {timeframe}
            </span>
          )}
          {info && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {onExport && (
            <Button variant="ghost" size="sm" onClick={onExport}>
              <Download className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewModule && (
                <DropdownMenuItem onClick={onViewModule}>View Module</DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={onExport}>Export Data</DropdownMenuItem>
              )}
              <DropdownMenuItem>View as Table</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Content */}
      <div className="min-h-[280px]">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">
          {footer}
        </div>
      )}
    </Card>
  );
}
