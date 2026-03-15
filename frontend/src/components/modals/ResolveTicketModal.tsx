import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Check } from 'lucide-react';

interface ResolveTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  onConfirm: (summary: string) => void;
}

export function ResolveTicketModal({
  open,
  onOpenChange,
  ticketId,
  onConfirm,
}: ResolveTicketModalProps) {
  const [summary, setSummary] = useState('');

  const handleConfirm = () => {
    onConfirm(summary.trim());
    setSummary('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Resolve Ticket
          </DialogTitle>
          <DialogDescription>
            Mark ticket {ticketId} as resolved and completed. This will move it to the Completed column.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Resolution Summary (optional)</Label>
            <Textarea
              id="summary"
              placeholder="Describe how the issue was resolved..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Resolve & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
