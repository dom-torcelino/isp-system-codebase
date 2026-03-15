import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface EscalateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  onConfirm: (reason: string) => void;
}

export function EscalateTicketModal({
  open,
  onOpenChange,
  ticketId,
  onConfirm,
}: EscalateTicketModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Escalate Ticket
          </DialogTitle>
          <DialogDescription>
            Flag ticket {ticketId} for manager review. This will move the ticket to the Escalated column.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Escalation (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Describe why this ticket needs escalation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Escalate Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
