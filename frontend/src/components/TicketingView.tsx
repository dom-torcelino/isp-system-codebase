import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Plus, Filter, X, MoreVertical, Clock, AlertCircle, CheckCircle2, Wrench, MapPin, Phone, Mail, Calendar, User, FileText, TrendingUp, Search } from 'lucide-react';
import { sampleTickets } from '../lib/sample-data';
import { UserRole, Ticket } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface TicketingViewProps {
  userRole: UserRole;
}

interface TicketDetail extends Ticket {
  description?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  scheduledDate?: string;
  repairNotes?: string;
  completionPercentage?: number;
}

const sampleTicketDetails: TicketDetail[] = sampleTickets.map((ticket, idx) => ({
  ...ticket,
  description: idx === 0 ? 'Fiber optic cable damaged near customer premises. Connection lost since yesterday.' : 
               idx === 1 ? 'New fiber installation required for business customer. 100Mbps plan.' :
               idx === 2 ? 'Customer relocating to new address. Service transfer needed.' :
               idx === 3 ? 'Router configuration issues. Customer unable to connect devices.' :
               'Internet connection intermittent. Signal dropping frequently.',
  address: idx === 0 ? '123 Makati Ave, Makati City' :
           idx === 1 ? '456 BGC, Taguig City' :
           idx === 2 ? '789 Ortigas, Pasig City' :
           idx === 3 ? '321 QC Circle, Quezon City' :
           '654 Ermita, Manila',
  contactPhone: '+63 917 123 4567',
  contactEmail: ticket.customer.toLowerCase().replace(' ', '.') + '@mail.com',
  createdAt: idx === 0 ? '2025-10-19 09:30 AM' :
             idx === 1 ? '2025-10-20 02:15 PM' :
             idx === 2 ? '2025-10-18 11:00 AM' :
             idx === 3 ? '2025-10-17 08:45 AM' :
             '2025-10-19 04:20 PM',
  updatedAt: '2025-10-20 10:30 AM',
  scheduledDate: idx === 1 ? '2025-10-21 02:00 PM' : idx === 0 ? '2025-10-20 04:00 PM' : undefined,
  repairNotes: ticket.status === 'Ongoing' ? 'Technician dispatched. En route to customer location.' : undefined,
  completionPercentage: ticket.status === 'Completed' ? 100 :
                        ticket.status === 'Ongoing' ? 45 :
                        ticket.status === 'Escalated' ? 30 :
                        0,
}));

const activityTimeline = [
  { time: '10:30 AM', action: 'Technician updated status', detail: 'En route to customer location', user: 'JL' },
  { time: '09:45 AM', action: 'Ticket assigned', detail: 'Assigned to Juan Lopez (JL)', user: 'System' },
  { time: '09:30 AM', action: 'Ticket created', detail: 'High priority repair request', user: 'Support' },
];

export function TicketingView({ userRole }: TicketingViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [tickets, setTickets] = useState<TicketDetail[]>(sampleTicketDetails);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredTickets = tickets.filter((ticket) => {
    // Technician role: only show assigned tickets
    if (userRole === 'Technician' && ticket.assignee !== 'JL') return false;
    
    if (selectedCategory !== 'all' && ticket.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && ticket.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && ticket.status !== selectedStatus) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.id.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const hasFilters = selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all' || searchQuery !== '';

  const handleAssignTechnician = (ticketId: string) => {
    toast.success('Technician assigned successfully');
  };

  const handleEscalate = (ticketId: string) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: 'Escalated' as const } : t
    ));
    toast.warning('Ticket escalated to senior technician');
  };

  const handleCloseTicket = (ticketId: string) => {
    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: 'Completed' as const, completionPercentage: 100 } : t
    ));
    setSelectedTicket(null);
    toast.success('Ticket closed successfully');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'Medium':
        return <Clock className="h-4 w-4 text-warning-500" />;
      case 'Low':
        return <CheckCircle2 className="h-4 w-4 text-success-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Ongoing':
        return 'bg-info-100 text-info-700 border-info-200';
      case 'Escalated':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Completed':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Stats calculations
  const stats = {
    total: filteredTickets.length,
    pending: filteredTickets.filter(t => t.status === 'Pending').length,
    ongoing: filteredTickets.filter(t => t.status === 'Ongoing').length,
    escalated: filteredTickets.filter(t => t.status === 'Escalated').length,
    overdue: filteredTickets.filter(t => t.slaEta === 'Overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2>Ticketing & Repair</h2>
          <p className="text-muted-foreground">Manage service requests and track SLA compliance</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create ticket
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Tickets</p>
              <p className="text-foreground">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning-700" />
            </div>
            <div>
              <p className="text-muted-foreground">Pending</p>
              <p className="text-foreground">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-info-700" />
            </div>
            <div>
              <p className="text-muted-foreground">Ongoing</p>
              <p className="text-foreground">{stats.ongoing}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-muted-foreground">Escalated</p>
              <p className="text-foreground">{stats.escalated}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-error-700" />
            </div>
            <div>
              <p className="text-muted-foreground">Overdue SLA</p>
              <p className="text-foreground text-destructive">{stats.overdue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets by ID, customer, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Escalated">Escalated</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{filteredTickets.length} tickets</span>
            <Separator orientation="vertical" className="h-6" />
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'list')} className="w-auto">
              <TabsList>
                <TabsTrigger value="kanban" className="text-xs">Kanban</TabsTrigger>
                <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {['Pending', 'Ongoing', 'Escalated', 'Completed'].map((status) => {
            const statusTickets = filteredTickets.filter((t) => t.status === status);
            return (
              <div key={status}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3>{status}</h3>
                    <Badge variant="secondary">{statusTickets.length}</Badge>
                  </div>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {statusTickets.map((ticket) => (
                        <Card 
                          key={ticket.id} 
                          className="p-3 border-2 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(ticket.priority)}
                              <span className="text-sm">{ticket.id}</span>
                            </div>
                            <Badge className={getStatusColor(ticket.priority)} variant="outline">
                              {ticket.priority}
                            </Badge>
                          </div>
                          
                          <p className="mb-2">{ticket.customer}</p>
                          <p className="text-sm text-muted-foreground mb-3">{ticket.category}</p>
                          
                          {ticket.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                          )}
                          
                          {ticket.completionPercentage !== undefined && ticket.completionPercentage > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs">{ticket.completionPercentage}%</span>
                              </div>
                              <Progress value={ticket.completionPercentage} className="h-1.5" />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Age: {ticket.age}</span>
                            <span className={ticket.slaEta === 'Overdue' ? 'text-destructive' : 'text-muted-foreground'}>
                              {ticket.slaEta}
                            </span>
                          </div>
                          
                          {ticket.assignee !== '-' && (
                            <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                {ticket.assignee}
                              </div>
                              <span className="text-xs text-muted-foreground">Assigned</span>
                            </div>
                          )}
                          
                          {ticket.scheduledDate && (
                            <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{ticket.scheduledDate}</span>
                            </div>
                          )}
                        </Card>
                      ))}
                      {statusTickets.length === 0 && (
                        <div className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">No {status.toLowerCase()} tickets</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>SLA ETA</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(ticket.priority)}
                      {ticket.id}
                    </div>
                  </TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.priority as any} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    {ticket.completionPercentage !== undefined && (
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={ticket.completionPercentage} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{ticket.completionPercentage}%</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{ticket.age}</TableCell>
                  <TableCell className={ticket.slaEta === 'Overdue' ? 'text-destructive' : ''}>
                    {ticket.slaEta}
                  </TableCell>
                  <TableCell>
                    {ticket.assignee !== '-' ? (
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {ticket.assignee}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAssignTechnician(ticket.id); }}>
                          Assign technician
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEscalate(ticket.id); }}>
                          Escalate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleCloseTicket(ticket.id); }}
                        >
                          Close ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No tickets match your filters.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="flex items-center gap-3">
                  {selectedTicket?.id}
                  <Badge className={getStatusColor(selectedTicket?.status || '')} variant="outline">
                    {selectedTicket?.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedTicket?.category} - Created {selectedTicket?.createdAt}
                </DialogDescription>
              </div>
              {getPriorityIcon(selectedTicket?.priority || '')}
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="repair">Repair Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex-1 overflow-y-auto space-y-4 mt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4>Customer Information</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedTicket?.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">{selectedTicket?.contactEmail}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm">{selectedTicket?.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4>Service Location</h4>
                  </div>
                  <p className="text-sm mb-3">{selectedTicket?.address}</p>
                  <div className="space-y-2">
                    {selectedTicket?.scheduledDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Scheduled Visit</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{selectedTicket.scheduledDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Issue Description */}
              <Card className="p-4">
                <h4 className="mb-2">Issue Description</h4>
                <p className="text-sm text-muted-foreground">{selectedTicket?.description}</p>
              </Card>

              {/* Progress & SLA */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="mb-3">Repair Progress</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion</span>
                      <span className="text-sm">{selectedTicket?.completionPercentage}%</span>
                    </div>
                    <Progress value={selectedTicket?.completionPercentage} />
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="mb-3">SLA Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time Remaining</span>
                      <span className={`text-sm ${selectedTicket?.slaEta === 'Overdue' ? 'text-destructive' : ''}`}>
                        {selectedTicket?.slaEta}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ticket Age</span>
                      <span className="text-sm">{selectedTicket?.age}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Assignment */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1">Assigned Technician</h4>
                    {selectedTicket?.assignee !== '-' ? (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {selectedTicket?.assignee}
                        </div>
                        <div>
                          <p className="text-sm">Juan Lopez</p>
                          <p className="text-xs text-muted-foreground">Field Technician</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">No technician assigned</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAssignTechnician(selectedTicket?.id || '')}>
                    {selectedTicket?.assignee !== '-' ? 'Reassign' : 'Assign'}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto mt-4">
              <div className="space-y-4">
                {activityTimeline.map((activity, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      {idx < activityTimeline.length - 1 && (
                        <div className="flex-1 w-px bg-border mt-2 mb-2" style={{ minHeight: '40px' }} />
                      )}
                    </div>
                    <Card className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-1">
                        <p>{activity.action}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="repair" className="flex-1 overflow-y-auto mt-4">
              <Card className="p-4 mb-4">
                <h4 className="mb-3">Technician Notes</h4>
                {selectedTicket?.repairNotes ? (
                  <p className="text-sm text-muted-foreground">{selectedTicket.repairNotes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No repair notes yet.</p>
                )}
              </Card>

              <Card className="p-4">
                <h4 className="mb-3">Add Note</h4>
                <Textarea placeholder="Enter repair notes, findings, or updates..." rows={4} className="mb-3" />
                <Button size="sm">Add Note</Button>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => handleEscalate(selectedTicket?.id || '')}>
              Escalate
            </Button>
            <Button variant="destructive" onClick={() => handleCloseTicket(selectedTicket?.id || '')}>
              Close Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Submit a new service request for a customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" placeholder="Search customer..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="support">IT Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the issue..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Service Address</Label>
              <Input id="address" placeholder="Enter service location..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowCreateDialog(false);
              toast.success('Ticket created successfully');
            }}>
              Create ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
