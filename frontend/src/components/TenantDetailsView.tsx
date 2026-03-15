import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  ArrowLeft,
  MoreVertical,
  UserX,
  Mail,
  Edit,
  Trash2,
  Activity,
  Users,
  Receipt,
  Settings,
  Zap,
  Clock,
} from 'lucide-react';
import { UserRole } from '../types';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TenantDetailsViewProps {
  tenantId: string;
  onBack: () => void;
}

type TenantStatus = 'Active' | 'Trial' | 'Suspended';

export function TenantDetailsView({ tenantId, onBack }: TenantDetailsViewProps) {
  const [status, setStatus] = useState<TenantStatus>('Active');
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('7');

  const tenant = {
    id: tenantId,
    name: 'Speedy Fiber Networks',
    plan: 'Pro',
    seats: 20,
    mrr: 7999,
    createdDate: 'Oct 20, 2025',
    paymentMethod: 'Card',
    paymentStatus: 'Verified',
    adminEmail: 'admin@speedyfiber.ph',
  };

  const handleSuspend = () => {
    setStatus('Suspended');
    setShowSuspendDialog(false);
    toast.warning(`Tenant ${tenant.name} suspended`);
    setSuspendReason('');
    setSuspendDuration('7');
  };

  const handleResendInvite = () => {
    toast.success(`Admin invite resent to ${tenant.adminEmail}`);
  };

  const getStatusColor = (status: TenantStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'Trial':
        return 'bg-info-100 text-info-700 border-info-200';
      case 'Suspended':
        return 'bg-error-100 text-error-700 border-error-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2>{tenant.name}</h2>
              <Badge className={getStatusColor(status)} variant="outline">
                {status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Tenant ID: {tenant.id}</p>
          </div>

          <div className="flex items-center gap-2">
            {status === 'Suspended' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('Active');
                  toast.success('Tenant reactivated');
                }}
              >
                Reactivate
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setShowSuspendDialog(true)}>
                <UserX className="h-4 w-4 mr-2" />
                Suspend
              </Button>
            )}
            <Button variant="outline" onClick={handleResendInvite}>
              <Mail className="h-4 w-4 mr-2" />
              Resend invite
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete tenant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subheader chips */}
        <div className="flex items-center gap-3 mt-4">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {tenant.plan} • {tenant.seats} seats
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Receipt className="h-3 w-3 mr-1" />
            ₱{tenant.mrr.toLocaleString()} MRR
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Created {tenant.createdDate}
          </Badge>
          <Badge
            variant="outline"
            className={
              tenant.paymentStatus === 'Verified'
                ? 'bg-success-100 text-success-700 border-success-200'
                : 'bg-warning-100 text-warning-700 border-warning-200'
            }
          >
            {tenant.paymentMethod} • {tenant.paymentStatus}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Receipt className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Zap className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-muted-foreground mb-1">Active Customers</p>
              <p className="text-foreground">234</p>
              <p className="text-xs text-success-700">+12 this month</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground mb-1">Open Tickets</p>
              <p className="text-foreground">18</p>
              <p className="text-xs text-muted-foreground">3 high priority</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground mb-1">SLA At Risk</p>
              <p className="text-foreground">5</p>
              <p className="text-xs text-warning-700">Requires attention</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground mb-1">Payment Health</p>
              <p className="text-foreground">98.5%</p>
              <p className="text-xs text-success-700">On-time payments</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', action: 'New user added', detail: 'jose.cruz@speedyfiber.ph' },
                { time: '5 hours ago', action: 'Invoice paid', detail: 'INV-2025-001 • ₱7,999' },
                { time: '1 day ago', action: 'Ticket escalated', detail: 'TRX-09321 • Fiber outage' },
                { time: '2 days ago', action: 'SLA policy updated', detail: 'High priority: 4h → 3h' },
                { time: '3 days ago', action: 'Integration connected', detail: 'Mikrotik RouterOS' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Tenant Users</h3>
              <p className="text-sm text-muted-foreground">Manage users for {tenant.name}</p>
            </div>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>

          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: 'Admin User', email: 'admin@speedyfiber.ph', role: 'SystemAdmin', status: 'Active', lastActive: '2 min ago' },
                  { name: 'Jose Cruz', email: 'jose.cruz@speedyfiber.ph', role: 'Support', status: 'Active', lastActive: '1 hour ago' },
                  { name: 'Maria Santos', email: 'maria.santos@speedyfiber.ph', role: 'Technician', status: 'Active', lastActive: '5 hours ago' },
                ].map((user, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Billing & Invoices</h3>
              <p className="text-sm text-muted-foreground">Payment history and invoicing</p>
            </div>
            <Button variant="outline">Generate Invoice</Button>
          </div>

          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { invoice: 'INV-2025-001', date: 'Oct 15, 2025', amount: 7999, status: 'Paid', dueDate: 'Oct 20, 2025' },
                  { invoice: 'INV-2025-002', date: 'Sep 15, 2025', amount: 7999, status: 'Paid', dueDate: 'Sep 20, 2025' },
                  { invoice: 'INV-2025-003', date: 'Aug 15, 2025', amount: 7999, status: 'Paid', dueDate: 'Aug 20, 2025' },
                ].map((inv, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">{inv.invoice}</TableCell>
                    <TableCell className="text-sm">{inv.date}</TableCell>
                    <TableCell>₱{inv.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{inv.dueDate}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Branding</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <Card className="p-6 border-dashed">
                  <p className="text-sm text-muted-foreground text-center">No logo uploaded</p>
                </Card>
              </div>
              <div className="space-y-2">
                <Label>Brand Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded border" style={{ backgroundColor: '#2A6AF0' }} />
                  <span className="text-sm">#2A6AF0</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">SLA & Grace Rules</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>High Priority</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">4</span>
                  <span className="text-muted-foreground">hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Medium Priority</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">8</span>
                  <span className="text-muted-foreground">hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Low Priority</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">24</span>
                  <span className="text-muted-foreground">hours</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Grace Period</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">7</span>
                <span className="text-muted-foreground">days</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Subdomain</h3>
            <p className="text-sm text-muted-foreground mb-2">
              speedyfiber.portal.app
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Integration Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Mikrotik RouterOS', status: 'Connected', lastSync: '2 min ago' },
                { name: 'Google Sheets Export', status: 'Connected', lastSync: '1 hour ago' },
                { name: 'Payment Gateway (Card)', status: 'Verified', lastSync: 'Active' },
              ].map((integration, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>{integration.name}</p>
                    <p className="text-sm text-muted-foreground">Last sync: {integration.lastSync}</p>
                  </div>
                  <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Audit Log</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { time: '10:45 AM', actor: 'admin@speedyfiber.ph', action: 'User Created', details: 'jose.cruz@speedyfiber.ph' },
                  { time: '09:30 AM', actor: 'System', action: 'Invoice Generated', details: 'INV-2025-001' },
                  { time: '08:15 AM', actor: 'admin@speedyfiber.ph', action: 'SLA Updated', details: 'High priority: 4h → 3h' },
                  { time: 'Yesterday', actor: 'admin@speedyfiber.ph', action: 'Integration Added', details: 'Mikrotik RouterOS' },
                ].map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-sm">{entry.time}</TableCell>
                    <TableCell className="text-sm">{entry.actor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Temporarily disable access for {tenant.name}. Users will not be able to log in during suspension.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason for suspension</Label>
              <Textarea
                id="suspend-reason"
                placeholder="e.g., Payment overdue, Policy violation"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspend-duration">Suspension Duration</Label>
              <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Suspend Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
