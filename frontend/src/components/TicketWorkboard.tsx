import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu';
import { Plus, Search, MoreVertical, MoreHorizontal, User, AlertTriangle, ExternalLink } from 'lucide-react';
import { UserRole } from '../types';
import { Ticket, TicketStatus, TicketBoard, ModalType } from '../types/ticketing';
import { cn } from './ui/utils';

interface TicketWorkboardProps {
  userRole: UserRole;
  ticketMap: Map<string, Ticket>;
  board: TicketBoard;
  onOpenModal: (modal: ModalType, ticketId?: string) => void;
  onMoveTicket: (ticketId: string, newStatus: TicketStatus) => void;
}

export function TicketWorkboard({
  userRole,
  ticketMap,
  board,
  onOpenModal,
  onMoveTicket,
}: TicketWorkboardProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets by current user if Technician
  const getFilteredTickets = (status: TicketStatus): Ticket[] => {
    const statusKey = status.toLowerCase() as keyof TicketBoard;
    const ticketIds = board[statusKey];
    
    return ticketIds
      .map(id => ticketMap.get(id))
      .filter((ticket): ticket is Ticket => {
        if (!ticket) return false;
        
        // Technician only sees their own tickets
        if (userRole === 'Technician' && ticket.assignee !== 'JL') return false;
        
        // Apply filters
        if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
        if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
        if (assigneeFilter !== 'all' && ticket.assignee !== assigneeFilter) return false;
        if (searchQuery && !ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        return true;
      });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-l-rose-500';
      case 'Medium':
        return 'border-l-amber-500';
      case 'Low':
        return 'border-l-emerald-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Repair':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700';
      case 'Installation':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700';
      case 'IT Support':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-700';
      case 'Transfer':
        return 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-700';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700';
      case 'Low':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEtaStyle = (ticket: Ticket) => {
    if (ticket.status === 'Completed') {
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }

    const now = new Date();
    const due = new Date(ticket.slaDueAt);
    const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 0) {
      return 'bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 border-error-200 dark:border-error-700';
    } else if (hoursRemaining < 2) {
      return 'bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 border-error-200 dark:border-error-700';
    } else if (hoursRemaining < 4) {
      return 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-700';
    } else {
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const getEtaText = (ticket: Ticket) => {
    if (ticket.status === 'Completed') return 'Met';
    
    const now = new Date();
    const due = new Date(ticket.slaDueAt);
    const hoursRemaining = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor(((due.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursRemaining < 0) return 'Overdue';
    if (hoursRemaining === 0) return `${minutesRemaining}m`;
    if (minutesRemaining === 0) return `${hoursRemaining}h`;
    return `${hoursRemaining}h ${minutesRemaining}m`;
  };

  const isAtRisk = (ticket: Ticket) => {
    if (ticket.status === 'Completed') return false;
    const now = new Date();
    const due = new Date(ticket.slaDueAt);
    const hoursRemaining = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursRemaining < 2 || hoursRemaining < 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2>Ticketing & Repair — Workboard</h2>
          <p className="text-sm text-muted-foreground">Live service requests · track SLA compliance</p>
        </div>
        <div className="flex items-center gap-3">
          {(userRole === 'SuperAdmin' || userRole === 'SystemAdmin' || userRole === 'CustomerSupport') && (
            <Button variant="outline" size="sm">
              Bulk Assign
            </Button>
          )}
          <Button onClick={() => onOpenModal('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
          
          {/* Kebab Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(userRole === 'SuperAdmin' || userRole === 'SystemAdmin') && (
                <DropdownMenuItem onClick={() => onOpenModal('slaSettings')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalation Rules
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Installation">Installation</SelectItem>
              <SelectItem value="Repair">Repair</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
              <SelectItem value="IT Support">IT Support</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="JL">JL</SelectItem>
              <SelectItem value="RD">RD</SelectItem>
              <SelectItem value="TM">TM</SelectItem>
              <SelectItem value="None">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-5">
        {(['Pending', 'Ongoing', 'Escalated', 'Completed'] as const).map((status) => {
          const tickets = getFilteredTickets(status);
          const displayTickets = tickets.slice(0, 6);
          const hasMore = tickets.length > 6;
          
          const colorMap = {
            Pending: { bg: 'bg-yellow-500', dot: 'bg-yellow-500' },
            Ongoing: { bg: 'bg-blue-500', dot: 'bg-blue-500' },
            Escalated: { bg: 'bg-red-500', dot: 'bg-red-500' },
            Completed: { bg: 'bg-green-500', dot: 'bg-green-500' },
          };

          return (
            <div key={status} className="flex flex-col rounded-lg p-3 bg-muted/30">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', colorMap[status].dot)} />
                  <span className="font-medium">{status}</span>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {tickets.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                {displayTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={cn(
                      'p-3 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 group',
                      getPriorityColor(ticket.priority)
                    )}
                    onClick={() => onOpenModal('details', ticket.id)}
                  >
                    {/* Quick Actions Menu */}
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
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Move to...
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {status !== 'Pending' && (
                                <DropdownMenuItem onClick={() => onMoveTicket(ticket.id, 'Pending')}>
                                  Pending
                                </DropdownMenuItem>
                              )}
                              {status !== 'Ongoing' && (
                                <DropdownMenuItem onClick={() => onMoveTicket(ticket.id, 'Ongoing')}>
                                  Ongoing
                                </DropdownMenuItem>
                              )}
                              {status !== 'Escalated' && (userRole === 'SuperAdmin' || userRole === 'SystemAdmin' || userRole === 'CustomerSupport') && (
                                <DropdownMenuItem onClick={() => onMoveTicket(ticket.id, 'Escalated')}>
                                  Escalated
                                </DropdownMenuItem>
                              )}
                              {status !== 'Completed' && (
                                <DropdownMenuItem onClick={() => onMoveTicket(ticket.id, 'Completed')}>
                                  Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          {(userRole === 'SuperAdmin' || userRole === 'SystemAdmin' || userRole === 'CustomerSupport') && (
                            <DropdownMenuItem onClick={() => onOpenModal('assign', ticket.id)}>
                              <User className="h-4 w-4 mr-2" />
                              Reassign
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Card Content */}
                    <p className="font-bold text-sm mb-1 pr-8">{ticket.id}</p>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{ticket.customer}</p>

                    {/* SLA ETA + At Risk */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] px-1.5 py-0.5 font-medium', getEtaStyle(ticket))}
                      >
                        ETA {getEtaText(ticket)}
                      </Badge>
                      {isAtRisk(ticket) && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0.5 font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
                        >
                          At risk
                        </Badge>
                      )}
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn('text-xs px-2 py-0.5 font-medium', getCategoryColor(ticket.category))}
                        >
                          {ticket.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn('text-xs px-2 py-0.5 font-medium', getPriorityBadgeColor(ticket.priority))}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{ticket.assignee}</AvatarFallback>
                      </Avatar>
                    </div>
                  </Card>
                ))}

                {hasMore && (
                  <div className="text-center py-2">
                    <span className="text-xs text-muted-foreground">
                      … +{tickets.length - 6} more
                    </span>
                  </div>
                )}

                {displayTickets.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-background/50">
                    No tickets
                  </div>
                )}
              </div>

              {/* Add Ticket Button (Pending only) */}
              {status === 'Pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenModal('create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add a ticket
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
