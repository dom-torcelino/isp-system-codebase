import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { X, Clock, MapPin, Phone, Mail, AlertTriangle, Check, Navigation } from 'lucide-react';
import { UserRole } from '../types';
import { Ticket, ModalType } from '../types/ticketing';
import { cn } from './ui/utils';

interface TicketDetailsDrawerV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  userRole: UserRole;
  onOpenModal: (modal: ModalType, ticketId?: string) => void;
  onAddNote: (ticketId: string, note: string) => void;
}

export function TicketDetailsDrawerV2({
  open,
  onOpenChange,
  ticket,
  userRole,
  onOpenModal,
  onAddNote,
}: TicketDetailsDrawerV2Props) {
  const [noteText, setNoteText] = useState('');

  if (!ticket) return null;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    onAddNote(ticket.id, noteText.trim());
    setNoteText('');
  };

  // Calculate SLA status
  const getSLAStatus = () => {
    if (ticket.status === 'Completed') return { text: 'Met', color: 'success' };
    
    const now = new Date();
    const due = new Date(ticket.slaDueAt);
    const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) return { text: 'Overdue', color: 'error' };
    if (hoursRemaining < 2) return { text: 'At Risk', color: 'error' };
    if (hoursRemaining < 4) return { text: 'Warning', color: 'warning' };
    return { text: 'On Track', color: 'success' };
  };

  const slaStatus = getSLAStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
      case 'Ongoing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700';
      case 'Escalated':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700';
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const canAccept = ticket.status === 'Pending';
  const canEscalate = ticket.status !== 'Escalated' && ticket.status !== 'Completed';
  const canResolve = ticket.status !== 'Completed';
  const canReassign = userRole === 'SuperAdmin' || userRole === 'SystemAdmin' || userRole === 'CustomerSupport';

  // Technician restrictions
  const isTechnician = userRole === 'Technician';
  const canTechnicianEscalate = false; // Technicians cannot escalate
  const canTechnicianReassign = false; // Technicians cannot reassign

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] p-0 flex flex-col" side="right">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                {ticket.id}
                <Badge variant="outline" className={cn('text-xs', getStatusColor(ticket.status))}>
                  {ticket.status}
                </Badge>
              </SheetTitle>
              <SheetDescription className="mt-1">
                {ticket.customer}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Status Banner */}
            {(ticket.status === 'Escalated' || slaStatus.color === 'error') && (
              <Alert className={cn(
                'border-l-4',
                ticket.status === 'Escalated' 
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20'
              )}>
                <AlertTriangle className={cn(
                  'h-4 w-4',
                  ticket.status === 'Escalated' ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'
                )} />
                <AlertDescription className={cn(
                  ticket.status === 'Escalated' ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'
                )}>
                  {ticket.status === 'Escalated' 
                    ? 'This ticket has been escalated and requires manager review.'
                    : `SLA at risk: ${slaStatus.text}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Customer & Issue */}
            <div className="space-y-3">
              <h4 className="font-medium">Customer & Issue</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{ticket.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{ticket.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{ticket.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {ticket.description && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <p className="text-sm font-medium mt-1">{ticket.category}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <p className="text-sm font-medium mt-1">{ticket.priority}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Assignee</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{ticket.assignee}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{ticket.assignee}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">SLA Due</Label>
                <p className="text-sm font-medium mt-1">
                  {new Date(ticket.slaDueAt).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {canAccept && !isTechnician && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                  onClick={() => {
                    onOpenModal('none');
                    onOpenChange(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept Job
                </Button>
              )}
              
              {ticket.status === 'Ongoing' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    // Handle onsite action
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Mark Onsite
                </Button>
              )}

              {canEscalate && !isTechnician && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-700"
                  onClick={() => {
                    onOpenModal('escalate', ticket.id);
                  }}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalate
                </Button>
              )}

              {canResolve && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-700"
                  onClick={() => {
                    onOpenModal('resolve', ticket.id);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Resolve / Close
                </Button>
              )}

              {canReassign && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onOpenModal('assign', ticket.id);
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reassign Technician
                </Button>
              )}
            </div>

            <Separator />

            {/* Internal Notes */}
            <div className="space-y-3">
              <h4 className="font-medium">Internal Notes</h4>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add internal note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
                  Add Note
                </Button>
              </div>

              {ticket.notes.length > 0 && (
                <div className="space-y-2 mt-4">
                  {ticket.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">{note.by}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.at).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Activity Timeline */}
            <div className="space-y-3">
              <h4 className="font-medium">Activity Timeline</h4>
              <div className="space-y-3">
                {ticket.history.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      {idx < ticket.history.length - 1 && (
                        <div className="w-px h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.action}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.at).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">by {item.by}</p>
                      {item.meta && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.meta.summary && <p>{item.meta.summary}</p>}
                          {item.meta.reason && <p>Reason: {item.meta.reason}</p>}
                          {item.meta.geo && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.meta.geo}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
