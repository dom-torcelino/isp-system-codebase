import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface AssignTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAssignee: string;
  onConfirm: (assignee: string) => void;
}

const technicians = [
  { id: 'JL', name: 'Jose Lopez' },
  { id: 'RD', name: 'Rico Diaz' },
  { id: 'TM', name: 'Tina Mendoza' },
];

export function AssignTicketModal({
  open,
  onOpenChange,
  currentAssignee,
  onConfirm,
}: AssignTicketModalProps) {
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee);

  const handleConfirm = () => {
    onConfirm(selectedAssignee);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>
            Select a technician to assign this ticket to.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedAssignee} onValueChange={setSelectedAssignee}>
            <div className="space-y-3">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={tech.id} id={tech.id} />
                  <Label htmlFor={tech.id} className="flex items-center gap-3 cursor-pointer flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{tech.id}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {tech.id}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
