import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  X,
  User,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity,
} from "lucide-react";
import { cn } from "./ui/utils";

interface TicketDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    id: string;
    customer: string;
    category: string;
    priority: string;
    assignee: string;
    description?: string;
    address?: string;
    contactPhone?: string;
    contactEmail?: string;
    createdAt?: string;
    scheduledDate?: string;
  };
  currentStatus: "Pending" | "Ongoing" | "Escalated" | "Completed";
  onSave: (updates: any) => void;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: "status" | "assignment" | "priority" | "note" | "created";
}

const activityLog: ActivityItem[] = [
  {
    id: "1",
    user: "Jane Doe",
    action: "changed status to Ongoing",
    timestamp: "Oct 20, 2025, 12:15 PM",
    type: "status",
  },
  {
    id: "2",
    user: "Juan Lopez",
    action: 'added a note: "Dispatched to customer location. ETA 30 minutes."',
    timestamp: "Oct 20, 2025, 11:45 AM",
    type: "note",
  },
  {
    id: "3",
    user: "Jane Doe",
    action: "assigned to Juan Lopez",
    timestamp: "Oct 20, 2025, 10:30 AM",
    type: "assignment",
  },
  {
    id: "4",
    user: "Maria Santos",
    action: "created this ticket",
    timestamp: "Oct 19, 2025, 9:30 AM",
    type: "created",
  },
];

export function TicketDetailsDrawer({
  open,
  onOpenChange,
  ticket,
  currentStatus,
  onSave,
}: TicketDetailsDrawerProps) {
  const [status, setStatus] = useState(currentStatus);
  const [assignee, setAssignee] = useState(ticket.assignee);
  const [priority, setPriority] = useState(ticket.priority);
  const [internalNote, setInternalNote] = useState("");

  // Sync status with currentStatus when ticket changes
  useEffect(() => {
    setStatus(currentStatus);
    setAssignee(ticket.assignee);
    setPriority(ticket.priority);
  }, [currentStatus, ticket.assignee, ticket.priority]);

  const handleSave = () => {
    onSave({
      status,
      assignee,
      priority,
      internalNote: internalNote.trim() ? internalNote : undefined,
    });
    setInternalNote("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setStatus(currentStatus);
    setAssignee(ticket.assignee);
    setPriority(ticket.priority);
    setInternalNote("");
    onOpenChange(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Ongoing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Escalated":
        return "bg-red-100 text-red-700 border-red-200";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "status":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "assignment":
        return <User className="h-4 w-4 text-purple-500" />;
      case "priority":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "note":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "created":
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-bold">{ticket.id}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground mt-1">
                Ticket Details
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
            {/* Status Control */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: string) =>
                  setStatus(
                    value as "Pending" | "Ongoing" | "Escalated" | "Completed"
                  )
                }
              >
                <SelectTrigger
                  id="status"
                  className={cn("w-full", getStatusColor(status))}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Description Section */}
            <div className="space-y-3">
              <h4 className="font-semibold">Customer & Issue</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{ticket.customer}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {ticket.description || "No description provided."}
                </p>
                {ticket.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{ticket.address}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {ticket.contactPhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{ticket.contactPhone}</span>
                    </div>
                  )}
                  {ticket.contactEmail && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{ticket.contactEmail}</span>
                    </div>
                  )}
                </div>
                {ticket.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {ticket.createdAt}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Assignee & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger id="assignee">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JL">Juan Lopez (JL)</SelectItem>
                    <SelectItem value="RD">Rosa Diaz (RD)</SelectItem>
                    <SelectItem value="TM">Tony Mendoza (TM)</SelectItem>
                    <SelectItem value="EG">Elena Garcia (EG)</SelectItem>
                    <SelectItem value="-">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger
                    id="priority"
                    className={cn(getPriorityColor(priority))}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Internal Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add comments or updates for your team..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                These notes are visible only to staff members.
              </p>
            </div>

            <Separator />

            {/* Activity Log */}
            <div className="space-y-3">
              <h4 className="font-semibold">Activity Log</h4>
              <div className="space-y-3">
                {activityLog.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="bg-muted rounded-full p-1.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < activityLog.length - 1 && (
                        <div className="w-px h-full bg-border my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-3">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between gap-3">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {currentStatus !== "Completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatus("Completed");
                    onSave({
                      status: "Completed",
                      assignee,
                      priority,
                      internalNote: internalNote.trim() || undefined,
                    });
                    onOpenChange(false);
                  }}
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-700"
                >
                  Resolve
                </Button>
              )}
              {currentStatus !== "Escalated" &&
                currentStatus !== "Completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatus("Escalated");
                      onSave({
                        status: "Escalated",
                        assignee,
                        priority,
                        internalNote: internalNote.trim() || undefined,
                      });
                      onOpenChange(false);
                    }}
                    className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-200 dark:border-red-700"
                  >
                    Escalate
                  </Button>
                )}
            </div>

            {/* Save/Cancel */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
