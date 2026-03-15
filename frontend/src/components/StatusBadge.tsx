import { Badge } from './ui/badge';
import { cn } from './ui/utils';

type Status =
  | 'Pending'
  | 'Ongoing'
  | 'Escalated'
  | 'Completed'
  | 'Overdue'
  | 'InDispute'
  | 'Active'
  | 'Suspended'
  | 'Trial'
  | 'Paid'
  | 'Partial';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case 'Completed':
      case 'Paid':
      case 'Active':
        return 'default';
      case 'Pending':
      case 'Trial':
        return 'secondary';
      case 'Ongoing':
      case 'Partial':
        return 'outline';
      case 'Escalated':
      case 'Overdue':
      case 'InDispute':
        return 'destructive';
      case 'Suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'Completed':
      case 'Paid':
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Pending':
      case 'Trial':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Ongoing':
      case 'Partial':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'Escalated':
      case 'Overdue':
      case 'InDispute':
      case 'Suspended':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={cn(getBgColor(), className)}>
      {status === 'InDispute' ? 'In Dispute' : status}
    </Badge>
  );
}
