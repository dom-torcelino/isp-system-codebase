import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Plus,
  X,
  AlertCircle,
  ExternalLink,
  MoreVertical,
  User,
  AlertTriangle,
  Archive,
  MoreHorizontal,
} from "lucide-react";
import { UserRole, Ticket } from "../types";
import { ColumnChart } from "./charts/ColumnChart";
import { DonutChart } from "./charts/DonutChart";
import { ChartCard } from "./charts/ChartCard";
import { TicketDetailsDrawer } from "./TicketDetailsDrawer";
import { toast } from "sonner";
import { cn } from "./ui/utils";

interface TicketingViewEnhancedProps {
  userRole: UserRole;
}

// Ticket data without status (status is derived from board position)
interface TicketData {
  id: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  age: string;
  slaEta: string;
  assignee: string;
  description?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdAt?: string;
}

type TicketCategory = "Installation" | "Repair" | "Transfer" | "IT Support";
type TicketPriority = "Low" | "Medium" | "High";

const ticketsByDayData = [
  { date: "Oct 14", Pending: 12, Ongoing: 8, Escalated: 3, Completed: 15 },
  { date: "Oct 15", Pending: 15, Ongoing: 10, Escalated: 2, Completed: 18 },
  { date: "Oct 16", Pending: 10, Ongoing: 12, Escalated: 4, Completed: 20 },
  { date: "Oct 17", Pending: 14, Ongoing: 9, Escalated: 3, Completed: 16 },
  { date: "Oct 18", Pending: 11, Ongoing: 11, Escalated: 5, Completed: 19 },
  { date: "Oct 19", Pending: 13, Ongoing: 10, Escalated: 4, Completed: 17 },
  { date: "Oct 20", Pending: 9, Ongoing: 13, Escalated: 2, Completed: 21 },
];

const ticketsByCategoryData = [
  { name: "Repair", value: 38, fill: "hsl(var(--chart-4))" },
  { name: "Installation", value: 32, fill: "hsl(var(--chart-1))" },
  { name: "IT Support", value: 18, fill: "hsl(var(--chart-5))" },
  { name: "Transfer", value: 12, fill: "hsl(var(--chart-3))" },
];

// Initial ticket data (no status field - derived from board position)
const initialTicketsData: TicketData[] = [
  // Pending
  {
    id: "TRX-09321",
    customer: "Maria Santos",
    category: "Repair",
    priority: "High",
    assignee: "JL",
    age: "2d",
    slaEta: "1h",
    description: "Fiber optic cable damaged near customer premises.",
    address: "123 Makati Ave, Makati City",
    contactPhone: "+63 917 123 4567",
    contactEmail: "maria.santos@mail.com",
    createdAt: "Oct 19, 2025, 9:30 AM",
  },
  {
    id: "TRX-09322",
    customer: "Juan Dela Cruz",
    category: "Installation",
    priority: "Medium",
    assignee: "RD",
    age: "1d",
    slaEta: "4h",
    description: "New fiber installation required for business customer.",
    address: "456 BGC, Taguig City",
    contactPhone: "+63 917 234 5678",
    contactEmail: "juan.delacruz@mail.com",
    createdAt: "Oct 20, 2025, 2:15 PM",
  },
  {
    id: "TRX-09323",
    customer: "Rosa Martinez",
    category: "Transfer",
    priority: "Low",
    assignee: "-",
    age: "3d",
    slaEta: "8h",
    description: "Customer relocating to new address. Service transfer needed.",
    address: "789 Ortigas, Pasig City",
    contactPhone: "+63 917 345 6789",
    contactEmail: "rosa.martinez@mail.com",
    createdAt: "Oct 18, 2025, 11:00 AM",
  },
  {
    id: "TRX-09324",
    customer: "Carlos Ramos",
    category: "IT Support",
    priority: "High",
    assignee: "TM",
    age: "4d",
    slaEta: "2h",
    description:
      "Router configuration issues. Customer unable to connect devices.",
    address: "321 QC Circle, Quezon City",
    contactPhone: "+63 917 456 7890",
    contactEmail: "carlos.ramos@mail.com",
    createdAt: "Oct 17, 2025, 8:45 AM",
  },
  // Ongoing
  {
    id: "TRX-09310",
    customer: "Linda Santos",
    category: "Repair",
    priority: "High",
    assignee: "JL",
    age: "1d",
    slaEta: "3h",
    description:
      "Internet connection intermittent. Signal dropping frequently.",
    address: "654 Ermita, Manila",
    contactPhone: "+63 917 567 8901",
    contactEmail: "linda.santos@mail.com",
    createdAt: "Oct 19, 2025, 4:20 PM",
  },
  {
    id: "TRX-09311",
    customer: "Miguel Fernandez",
    category: "Installation",
    priority: "Medium",
    assignee: "RD",
    age: "2d",
    slaEta: "5h",
    description: "New installation for residential customer.",
    address: "111 Pasay, Pasay City",
    contactPhone: "+63 917 678 9012",
    contactEmail: "miguel.fernandez@mail.com",
    createdAt: "Oct 18, 2025, 10:00 AM",
  },
  {
    id: "TRX-09312",
    customer: "Elena Garcia",
    category: "IT Support",
    priority: "Low",
    assignee: "TM",
    age: "1d",
    slaEta: "6h",
    description: "Email configuration support needed.",
    address: "222 Paranaque, Paranaque City",
    contactPhone: "+63 917 789 0123",
    contactEmail: "elena.garcia@mail.com",
    createdAt: "Oct 19, 2025, 2:30 PM",
  },
  {
    id: "TRX-09313",
    customer: "Tony Reyes",
    category: "Repair",
    priority: "Medium",
    assignee: "JL",
    age: "3d",
    slaEta: "4h",
    description: "Connection drop issues during peak hours.",
    address: "333 Las Pinas, Las Pinas City",
    contactPhone: "+63 917 890 1234",
    contactEmail: "tony.reyes@mail.com",
    createdAt: "Oct 17, 2025, 3:15 PM",
  },
  {
    id: "TRX-09314",
    customer: "Ana Lopez",
    category: "Transfer",
    priority: "Low",
    assignee: "RD",
    age: "2d",
    slaEta: "7h",
    description: "Service relocation to new office.",
    address: "444 Muntinlupa, Muntinlupa City",
    contactPhone: "+63 917 901 2345",
    contactEmail: "ana.lopez@mail.com",
    createdAt: "Oct 18, 2025, 1:00 PM",
  },
  {
    id: "TRX-09315",
    customer: "Pedro Cruz",
    category: "IT Support",
    priority: "High",
    assignee: "TM",
    age: "1d",
    slaEta: "1h",
    description: "VPN connection not working.",
    address: "555 Caloocan, Caloocan City",
    contactPhone: "+63 917 012 3456",
    contactEmail: "pedro.cruz@mail.com",
    createdAt: "Oct 19, 2025, 11:45 AM",
  },
  {
    id: "TRX-09316",
    customer: "Sofia Diaz",
    category: "Repair",
    priority: "Medium",
    assignee: "JL",
    age: "2d",
    slaEta: "5h",
    description: "Slow connection speeds reported.",
    address: "666 Malabon, Malabon City",
    contactPhone: "+63 917 123 4567",
    contactEmail: "sofia.diaz@mail.com",
    createdAt: "Oct 18, 2025, 9:20 AM",
  },
  // Escalated
  {
    id: "TRX-09301",
    customer: "David Tan",
    category: "Repair",
    priority: "High",
    assignee: "JL",
    age: "5d",
    slaEta: "Overdue",
    description: "Complete service outage for 24+ hours.",
    address: "777 Navotas, Navotas City",
    contactPhone: "+63 917 234 5678",
    contactEmail: "david.tan@mail.com",
    createdAt: "Oct 15, 2025, 7:30 AM",
  },
  {
    id: "TRX-09302",
    customer: "Grace Kim",
    category: "Installation",
    priority: "High",
    assignee: "RD",
    age: "4d",
    slaEta: "Overdue",
    description: "Critical business installation delayed.",
    address: "888 Valenzuela, Valenzuela City",
    contactPhone: "+63 917 345 6789",
    contactEmail: "grace.kim@mail.com",
    createdAt: "Oct 16, 2025, 10:15 AM",
  },
  // Completed
  {
    id: "TRX-09290",
    customer: "Robert Lee",
    category: "Repair",
    priority: "Medium",
    assignee: "JL",
    age: "6d",
    slaEta: "Met",
    description: "Cable replacement completed successfully.",
    address: "999 Marikina, Marikina City",
    contactPhone: "+63 917 456 7890",
    contactEmail: "robert.lee@mail.com",
    createdAt: "Oct 14, 2025, 8:00 AM",
  },
  {
    id: "TRX-09291",
    customer: "Lisa Wong",
    category: "IT Support",
    priority: "Low",
    assignee: "TM",
    age: "5d",
    slaEta: "Met",
    description: "Router setup assistance completed.",
    address: "101 San Juan, San Juan City",
    contactPhone: "+63 917 567 8901",
    contactEmail: "lisa.wong@mail.com",
    createdAt: "Oct 15, 2025, 1:30 PM",
  },
  {
    id: "TRX-09292",
    customer: "Mark Chen",
    category: "Transfer",
    priority: "Medium",
    assignee: "RD",
    age: "7d",
    slaEta: "Met",
    description: "Service transfer completed without issues.",
    address: "102 Mandaluyong, Mandaluyong City",
    contactPhone: "+63 917 678 9012",
    contactEmail: "mark.chen@mail.com",
    createdAt: "Oct 13, 2025, 3:45 PM",
  },
];

const ITEM_TYPE = "TICKET";

interface DragItem {
  id: string;
  status: string;
}

interface TicketCardProps {
  ticket: TicketData;
  status: "Pending" | "Ongoing" | "Escalated" | "Completed";
  onClick: () => void;
  onQuickAction: (action: string) => void;
}

function TicketCard({
  ticket,
  status,
  onClick,
  onQuickAction,
}: TicketCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: ticket.id, status: status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-red-500";
      case "Medium":
        return "border-l-yellow-500";
      case "Low":
        return "border-l-gray-400";
      default:
        return "border-l-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Repair":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "Installation":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "IT Support":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20";
      case "Transfer":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEtaStyle = (eta: string) => {
    // Handle special cases
    if (eta === "Overdue" || eta === "Met") {
      return "bg-muted text-muted-foreground border-muted-foreground/20";
    }

    // Parse ETA (e.g., "1h", "2h 30m", "4h", "8h")
    const hours = parseInt(eta);

    if (isNaN(hours)) {
      return "bg-muted text-muted-foreground border-muted-foreground/20";
    }

    if (hours > 4) {
      return "bg-muted text-muted-foreground border-muted-foreground/20"; // Neutral
    } else if (hours >= 2) {
      return "bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-700"; // Warning
    } else {
      return "bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 border-error-200 dark:border-error-700"; // Danger
    }
  };

  const isAtRisk = (
    eta: string,
    status: "Pending" | "Ongoing" | "Escalated" | "Completed"
  ) => {
    if (status === "Completed") return false;
    const hours = parseInt(eta);
    return hours < 2 || eta === "Overdue";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200",
        isDragging && "opacity-[0.95] rotate-2 scale-105"
      )}
    >
      <Card
        className={cn(
          "p-3 cursor-pointer hover:shadow-md transition-all duration-200 border-l-[3px] relative bg-card group",
          getPriorityColor(ticket.priority),
          isDragging && "shadow-lg ring-2 ring-primary/20"
        )}
        onClick={onClick}
      >
        {/* Quick Actions Menu - Shows on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Move to...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {status !== "Pending" && (
                    <DropdownMenuItem
                      onClick={() => onQuickAction("move-pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                  )}
                  {status !== "Ongoing" && (
                    <DropdownMenuItem
                      onClick={() => onQuickAction("move-ongoing")}
                    >
                      Ongoing
                    </DropdownMenuItem>
                  )}
                  {status !== "Escalated" && (
                    <DropdownMenuItem
                      onClick={() => onQuickAction("move-escalated")}
                    >
                      Escalated
                    </DropdownMenuItem>
                  )}
                  {status !== "Completed" && (
                    <DropdownMenuItem
                      onClick={() => onQuickAction("move-completed")}
                    >
                      Completed
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onQuickAction("assignee")}>
                <User className="h-4 w-4 mr-2" />
                Change Assignee
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction("priority")}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Set Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction("note")}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Add Quick Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onQuickAction("archive")}
                className="text-destructive"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ticket ID */}
        <p className="font-bold text-sm mb-1 text-foreground pr-8">
          {ticket.id}
        </p>

        {/* Customer Name */}
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {ticket.customer}
        </p>

        {/* SLA ETA Chip + At Risk Badge */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0.5 flex-shrink-0 font-medium",
              getEtaStyle(ticket.slaEta)
            )}
          >
            ETA {ticket.slaEta}
          </Badge>
          {isAtRisk(ticket.slaEta, status) && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 flex-shrink-0 font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
            >
              At risk
            </Badge>
          )}
        </div>

        {/* Bottom Row: Category + Avatar */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-2 py-0.5 flex-shrink-0 font-medium",
              getCategoryColor(ticket.category)
            )}
          >
            {ticket.category}
          </Badge>

          {/* Assignee Avatar */}
          {ticket.assignee !== "-" && (
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarFallback className="text-[10px] font-semibold bg-primary text-primary-foreground">
                {ticket.assignee}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </Card>
    </div>
  );
}

interface KanbanColumnProps {
  status: "Pending" | "Ongoing" | "Escalated" | "Completed";
  color: string;
  dotColor: string;
  tickets: TicketData[];
  onDrop: (ticketId: string, newStatus: string) => void;
  onTicketClick: (
    ticketId: string,
    status: "Pending" | "Ongoing" | "Escalated" | "Completed"
  ) => void;
  onQuickAction: (ticketId: string, action: string) => void;
  onAddTicket?: () => void;
  isAddingTicket?: boolean;
  newTicketTitle?: string;
  onNewTicketTitleChange?: (value: string) => void;
  onCreateTicket?: () => void;
  onCancelAddTicket?: () => void;
}

function KanbanColumn({
  status,
  dotColor,
  tickets,
  onDrop,
  onTicketClick,
  onQuickAction,
  onAddTicket,
  isAddingTicket,
  newTicketTitle,
  onNewTicketTitleChange,
  onCreateTicket,
  onCancelAddTicket,
}: KanbanColumnProps) {
  const ref = useRef<HTMLDivElement>(null); // 2. Create a local ref

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const displayedTickets = tickets.slice(0, 6);
  const hasMore = tickets.length > 6;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-lg p-3 transition-all duration-200",
        isOver ? "bg-primary/5 ring-2 ring-primary/30" : "bg-muted/30"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={cn("h-2.5 w-2.5 rounded-full", dotColor)} />
          <h4 className="text-sm font-semibold">{status}</h4>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
          {tickets.length}
        </Badge>
      </div>

      {/* Ticket Cards */}
      <div className="space-y-2.5 flex-1 min-h-[400px] max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {displayedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            status={status}
            onClick={() => onTicketClick(ticket.id, status)}
            onQuickAction={(action) => onQuickAction(ticket.id, action)}
          />
        ))}

        {/* Show more indicator */}
        {hasMore && (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground">
              … +{tickets.length - 6} more
            </span>
          </div>
        )}

        {/* Empty state */}
        {displayedTickets.length === 0 && !isAddingTicket && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-background/50">
            No tickets
          </div>
        )}

        {/* Add Ticket Input (only for Pending) */}
        {status === "Pending" && isAddingTicket && (
          <Card className="p-3 border-2 border-primary/50 bg-background">
            <Input
              autoFocus
              placeholder="Enter ticket title..."
              value={newTicketTitle}
              onChange={(e) => onNewTicketTitleChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCreateTicket?.();
                } else if (e.key === "Escape") {
                  onCancelAddTicket?.();
                }
              }}
              className="text-sm mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onCreateTicket} className="flex-1">
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelAddTicket}>
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Ticket Button (only for Pending) */}
      {status === "Pending" && !isAddingTicket && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={onAddTicket}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a ticket
        </Button>
      )}
    </div>
  );
}

export function TicketingViewEnhanced({
  userRole,
}: TicketingViewEnhancedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );
  const [showSmartAlerts, setShowSmartAlerts] = useState(true);

  // SINGLE SOURCE OF TRUTH: Board structure (status derived from position in board)
  const [board, setBoard] = useState<{
    pending: string[];
    ongoing: string[];
    escalated: string[];
    completed: string[];
  }>({
    pending: ["TRX-09321", "TRX-09322", "TRX-09323", "TRX-09324"],
    ongoing: [
      "TRX-09310",
      "TRX-09311",
      "TRX-09312",
      "TRX-09313",
      "TRX-09314",
      "TRX-09315",
      "TRX-09316",
    ],
    escalated: ["TRX-09301", "TRX-09302"],
    completed: ["TRX-09290", "TRX-09291", "TRX-09292"],
  });

  // Ticket data (NO status field - status derived from board position only)
  const [ticketsData, setTicketsData] = useState<Map<string, TicketData>>(
    new Map(initialTicketsData.map((t) => [t.id, t]))
  );

  // Drawer state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [detailsStatus, setDetailsStatus] = useState<
    "Pending" | "Ongoing" | "Escalated" | "Completed"
  >("Pending");
  const [showTicketDetails, setShowTicketDetails] = useState(false);

  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");

  // Helper to get current status of a ticket from board
  const getTicketStatus = (
    ticketId: string
  ): "Pending" | "Ongoing" | "Escalated" | "Completed" | null => {
    if (board.pending.includes(ticketId)) return "Pending";
    if (board.ongoing.includes(ticketId)) return "Ongoing";
    if (board.escalated.includes(ticketId)) return "Escalated";
    if (board.completed.includes(ticketId)) return "Completed";
    return null;
  };

  // Get tickets for a specific status with filters applied
  const getTicketsByStatus = (
    status: "Pending" | "Ongoing" | "Escalated" | "Completed"
  ) => {
    const columnKey = status.toLowerCase() as keyof typeof board;
    return board[columnKey]
      .map((id) => ticketsData.get(id))
      .filter((ticket): ticket is TicketData => {
        if (!ticket) return false;
        if (userRole === "Technician" && ticket.assignee !== "JL") return false;
        if (selectedCategory !== "all" && ticket.category !== selectedCategory)
          return false;
        if (selectedPriority !== "all" && ticket.priority !== selectedPriority)
          return false;
        return true;
      });
  };

  // Move ticket between columns
  const moveTicket = (
    ticketId: string,
    fromStatus: string,
    toStatus: string
  ) => {
    const fromKey = fromStatus.toLowerCase() as keyof typeof board;
    const toKey = toStatus.toLowerCase() as keyof typeof board;

    setBoard((prev) => ({
      ...prev,
      [fromKey]: prev[fromKey].filter((id) => id !== ticketId),
      [toKey]: [ticketId, ...prev[toKey]],
    }));
  };

  const handleDrop = (ticketId: string, newStatus: string) => {
    const currentStatus = getTicketStatus(ticketId);
    if (!currentStatus || currentStatus === newStatus) return;

    moveTicket(ticketId, currentStatus, newStatus);

    // Update detailsStatus if this is the selected ticket
    if (selectedTicketId === ticketId) {
      setDetailsStatus(newStatus as any);
    }

    toast.success(`Ticket moved to ${newStatus}`);
  };

  const handleTicketClick = (
    ticketId: string,
    status: "Pending" | "Ongoing" | "Escalated" | "Completed"
  ) => {
    setSelectedTicketId(ticketId);
    setDetailsStatus(status);
    setShowTicketDetails(true);
  };

  const handleSaveTicket = (updates: any) => {
    if (!selectedTicketId) return;

    // Update ticket data
    const currentTicket = ticketsData.get(selectedTicketId);
    if (currentTicket) {
      setTicketsData(
        new Map(
          ticketsData.set(selectedTicketId, { ...currentTicket, ...updates })
        )
      );
    }

    // If status changed, move ticket
    if (updates.status && updates.status !== detailsStatus) {
      moveTicket(selectedTicketId, detailsStatus, updates.status);
      setDetailsStatus(updates.status);
    }

    toast.success("Ticket updated successfully");
  };

  const handleQuickAction = (ticketId: string, action: string) => {
    const ticket = ticketsData.get(ticketId);
    if (!ticket) return;

    const currentStatus = getTicketStatus(ticketId);
    if (!currentStatus) return;

    switch (action) {
      case "move-pending":
        moveTicket(ticketId, currentStatus, "Pending");
        if (selectedTicketId === ticketId) setDetailsStatus("Pending");
        toast.success(`Ticket ${ticket.id} moved to Pending`);
        break;
      case "move-ongoing":
        moveTicket(ticketId, currentStatus, "Ongoing");
        if (selectedTicketId === ticketId) setDetailsStatus("Ongoing");
        toast.success(`Ticket ${ticket.id} moved to Ongoing`);
        break;
      case "move-escalated":
        moveTicket(ticketId, currentStatus, "Escalated");
        if (selectedTicketId === ticketId) setDetailsStatus("Escalated");
        toast.success(`Ticket ${ticket.id} moved to Escalated`);
        break;
      case "move-completed":
        moveTicket(ticketId, currentStatus, "Completed");
        if (selectedTicketId === ticketId) setDetailsStatus("Completed");
        toast.success(`Ticket ${ticket.id} moved to Completed`);
        break;
      case "assignee":
        toast.info(`Change assignee for ${ticket.id}`);
        break;
      case "priority":
        toast.info(`Set priority for ${ticket.id}`);
        break;
      case "note":
        toast.info(`Add note to ${ticket.id}`);
        break;
      case "archive":
        // Remove from all columns
        setBoard((prev) => ({
          pending: prev.pending.filter((id) => id !== ticketId),
          ongoing: prev.ongoing.filter((id) => id !== ticketId),
          escalated: prev.escalated.filter((id) => id !== ticketId),
          completed: prev.completed.filter((id) => id !== ticketId),
        }));
        toast.success(`${ticket.id} archived`);
        break;
    }
  };

  const handleCreateTicket = () => {
    if (!newTicketTitle.trim()) {
      toast.error("Please enter a ticket title");
      return;
    }

    const newTicketId = `TRX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: TicketData = {
      id: newTicketId,
      customer: newTicketTitle,
      category: "Repair",
      priority: "Medium",
      assignee: "-",
      age: "0d",
      slaEta: "8h",
      description: "",
      createdAt: new Date().toLocaleString(),
    };

    // Add to ticket data
    setTicketsData(new Map(ticketsData.set(newTicketId, newTicket)));

    // Add to pending column (at the top)
    setBoard((prev) => ({
      ...prev,
      pending: [newTicketId, ...prev.pending],
    }));

    setNewTicketTitle("");
    setIsAddingTicket(false);
    toast.success(`Ticket ${newTicketId} created`);
  };

  // Quick stats for status pills
  const stats = {
    backlog: board.pending.length,
    dueToday: 12,
    atRisk: Array.from(ticketsData.values()).filter((t) => {
      const status = getTicketStatus(t.id);
      return status !== "Completed" && (t.slaEta === "1h" || t.slaEta === "2h");
    }).length,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2>Ticketing & Repair — Work in Progress</h2>
            <p className="text-sm text-muted-foreground">
              Live ticket board by status · Manage service requests & track SLA
              compliance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Bulk Assign
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>

            {/* Escalation Rules Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalation Rules
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Assignment Rules
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  SLA Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Unified Filter Bar */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Left: Dropdowns */}
            <div className="flex items-center gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[160px] h-9 border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Installation">Installation</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="IT Support">IT Support</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-[140px] h-9 border-border">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right: Status Pills */}
            <div className="flex items-center gap-2">
              <Button
                variant={
                  activeStatusFilter === "Pending" ? "secondary" : "ghost"
                }
                size="sm"
                className={cn(
                  "h-9 gap-2",
                  activeStatusFilter === "Pending" &&
                    "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() =>
                  setActiveStatusFilter(
                    activeStatusFilter === "Pending" ? null : "Pending"
                  )
                }
              >
                Backlog
                <Badge
                  variant="secondary"
                  className="ml-0 bg-background border-border font-semibold"
                >
                  {stats.backlog}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2"
                onClick={() => {
                  setActiveStatusFilter(null);
                  setSelectedPriority("all");
                }}
              >
                Due today
                <Badge
                  variant="secondary"
                  className="ml-0 bg-background border-border font-semibold"
                >
                  {stats.dueToday}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
              >
                At risk
                <Badge className="ml-0 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 font-semibold">
                  {stats.atRisk}
                </Badge>
              </Button>
            </div>
          </div>
        </Card>

        {/* Smart Alerts Banner */}
        {showSmartAlerts && (
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-yellow-100 dark:bg-yellow-800 rounded-full p-1.5 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Smart Alerts
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
                    <span className="font-semibold">2 anomalies detected</span>{" "}
                    and a{" "}
                    <span className="font-semibold">
                      spike of 28 escalations
                    </span>{" "}
                    in the last hour.
                  </p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 mt-2 font-medium"
                    size="sm"
                  >
                    Investigate Events{" "}
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded-full flex-shrink-0"
                onClick={() => setShowSmartAlerts(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* PRIMARY: Kanban Preview */}
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Work in Progress</h3>
              <p className="text-sm text-muted-foreground">
                Live ticket board by status - drag cards to update
              </p>
            </div>
            <Button variant="link" className="text-primary font-medium gap-1">
              View full board <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {[
              {
                status: "Pending" as const,
                color: "bg-yellow-500",
                dotColor: "bg-yellow-500",
              },
              {
                status: "Ongoing" as const,
                color: "bg-blue-500",
                dotColor: "bg-blue-500",
              },
              {
                status: "Escalated" as const,
                color: "bg-red-500",
                dotColor: "bg-red-500",
              },
              {
                status: "Completed" as const,
                color: "bg-green-500",
                dotColor: "bg-green-500",
              },
            ].map(({ status, color, dotColor }) => (
              <KanbanColumn
                key={status}
                status={status}
                color={color}
                dotColor={dotColor}
                tickets={getTicketsByStatus(status)}
                onDrop={handleDrop}
                onTicketClick={handleTicketClick}
                onQuickAction={handleQuickAction}
                onAddTicket={
                  status === "Pending"
                    ? () => setIsAddingTicket(true)
                    : undefined
                }
                isAddingTicket={status === "Pending" && isAddingTicket}
                newTicketTitle={newTicketTitle}
                onNewTicketTitleChange={setNewTicketTitle}
                onCreateTicket={handleCreateTicket}
                onCancelAddTicket={() => {
                  setIsAddingTicket(false);
                  setNewTicketTitle("");
                }}
              />
            ))}
          </div>
        </Card>

        {/* SECONDARY: Analytics Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Tickets by Status Per Day */}
          <div className="col-span-2">
            <ChartCard
              title="Tickets by Status Per Day"
              timeframe="Last 7 days"
              info="Daily breakdown of ticket statuses"
            >
              <div className="h-[280px]">
                <ColumnChart
                  data={ticketsByDayData}
                  xKey="date"
                  bars={[
                    {
                      key: "Pending",
                      label: "Pending",
                      color: "var(--chart-3)",
                    },
                    {
                      key: "Ongoing",
                      label: "Ongoing",
                      color: "var(--chart-1)",
                    },
                    {
                      key: "Escalated",
                      label: "Escalated",
                      color: "var(--chart-4)",
                    },
                    {
                      key: "Completed",
                      label: "Completed",
                      color: "var(--chart-2)",
                    },
                  ]}
                  unit="count"
                />
              </div>
            </ChartCard>
          </div>

          {/* Tickets by Category */}
          <ChartCard
            title="Tickets by Category"
            info="Distribution across service categories"
          >
            <div className="h-[280px]">
              <DonutChart
                data={ticketsByCategoryData.map((item) => ({
                  name: item.name,
                  value: item.value,
                  color: item.fill,
                }))}
                unit="count"
                centerLabel="Repair"
                centerSubtitle="38%"
              />
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {ticketsByCategoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Ticket Details Drawer */}
        {selectedTicketId && ticketsData.get(selectedTicketId) && (
          <TicketDetailsDrawer
            open={showTicketDetails}
            onOpenChange={setShowTicketDetails}
            ticket={ticketsData.get(selectedTicketId)!}
            currentStatus={detailsStatus}
            onSave={handleSaveTicket}
          />
        )}
      </div>
    </DndProvider>
  );
}
