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
import {
  Download,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Smartphone,
  Key,
  Users,
  Activity,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Search,
  MoreVertical,
  X,
  Eye,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { UserRole } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { Sparkline } from './charts/Sparkline';
import { LineChart } from './charts/LineChart';
import { DonutChart } from './charts/DonutChart';
import { ColumnChart } from './charts/ColumnChart';
import { ChartCard } from './charts/ChartCard';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AuthSecurityViewProps {
  userRole: UserRole;
}

// Sample data
const authEvents = [
  { time: '10:45 AM', user: 'maria.santos@mail.com', role: 'SystemAdmin', provider: 'Local', action: 'Login', result: 'Success', ip: '192.168.1.45', geo: 'Manila, PH', device: 'Chrome / Windows', risk: 'Low' },
  { time: '10:42 AM', user: 'jose.cruz@mail.com', role: 'Support', provider: 'SSO', action: 'Login', result: 'Success', ip: '192.168.1.23', geo: 'Quezon City, PH', device: 'Firefox / MacOS', risk: 'Low' },
  { time: '10:38 AM', user: 'suspicious@domain.com', role: '-', provider: 'Local', action: 'Login', result: 'Failed', ip: '45.123.45.67', geo: 'Unknown', device: 'Unknown', risk: 'High' },
  { time: '10:35 AM', user: 'ana.reyes@mail.com', role: 'Technician', provider: 'Local', action: 'MFA Challenge', result: 'Success', ip: '192.168.1.89', geo: 'Makati, PH', device: 'Mobile / iOS', risk: 'Low' },
  { time: '10:30 AM', user: 'pedro.aquino@mail.com', role: 'SuperAdmin', provider: 'SSO', action: 'Login', result: 'Success', ip: '192.168.1.12', geo: 'Taguig, PH', device: 'Chrome / Windows', risk: 'Medium' },
];

const activeSessions = [
  { user: 'maria.santos@mail.com', device: 'Chrome / Windows', ip: '192.168.1.45', created: '2h ago', lastActivity: '5m ago', mfa: true },
  { user: 'jose.cruz@mail.com', device: 'Firefox / MacOS', ip: '192.168.1.23', created: '4h ago', lastActivity: '12m ago', mfa: true },
  { user: 'ana.reyes@mail.com', device: 'Mobile / iOS', ip: '192.168.1.89', created: '1h ago', lastActivity: '3m ago', mfa: true },
  { user: 'pedro.aquino@mail.com', device: 'Chrome / Windows', ip: '192.168.1.12', created: '6h ago', lastActivity: '1m ago', mfa: true },
];

const rbacChanges = [
  { time: '09:45 AM', actor: 'admin@mail.com', change: 'Role Updated', target: 'maria.santos@mail.com', tenant: 'FiberFast ISP', detail: 'Support → SystemAdmin' },
  { time: '09:30 AM', actor: 'admin@mail.com', change: 'Permission Added', target: 'jose.cruz@mail.com', tenant: 'FiberFast ISP', detail: 'billing:write' },
  { time: '09:15 AM', actor: 'system', change: 'User Created', target: 'new.user@mail.com', tenant: 'FiberFast ISP', detail: 'Role: Support' },
  { time: '08:50 AM', actor: 'admin@mail.com', change: 'Permission Revoked', target: 'old.user@mail.com', tenant: 'FiberFast ISP', detail: 'tenants:delete' },
];

const apiKeys = [
  { name: 'Production API', scope: 'billing:*, customers:read', lastUsed: '5m ago', rotatesIn: '12 days', status: 'healthy' },
  { name: 'Analytics Service', scope: 'reports:read, metrics:read', lastUsed: '1h ago', rotatesIn: '45 days', status: 'healthy' },
  { name: 'Mobile App', scope: 'auth:*, customers:*', lastUsed: '2m ago', rotatesIn: '8 days', status: 'healthy' },
  { name: 'Legacy Integration', scope: 'tickets:read', lastUsed: '45d ago', rotatesIn: 'Overdue', status: 'warning' },
  { name: 'Webhook Service', scope: 'events:subscribe', lastUsed: '15m ago', rotatesIn: '22 days', status: 'healthy' },
];

const loginOutcomeData = [
  { date: 'Oct 14', success: 890, failed: 45, mfaChallenges: 320 },
  { date: 'Oct 15', success: 920, failed: 38, mfaChallenges: 340 },
  { date: 'Oct 16', success: 885, failed: 52, mfaChallenges: 315 },
  { date: 'Oct 17', success: 910, failed: 41, mfaChallenges: 335 },
  { date: 'Oct 18', success: 895, failed: 35, mfaChallenges: 328 },
  { date: 'Oct 19', success: 930, failed: 28, mfaChallenges: 352 },
  { date: 'Oct 20', success: 915, failed: 23, mfaChallenges: 345 },
];

const mfaMethodData = [
  { name: 'TOTP', value: 45, color: 'var(--chart-1)' },
  { name: 'SMS', value: 28, color: 'var(--chart-2)' },
  { name: 'Email', value: 15, color: 'var(--chart-3)' },
  { name: 'Push', value: 8, color: 'var(--chart-5)' },
  { name: 'FIDO2', value: 4, color: 'var(--chart-6)' },
];

const heatmapData = [
  { day: 'Mon', hours: [2, 1, 0, 0, 1, 3, 8, 12, 15, 18, 14, 11, 9, 7, 12, 15, 10, 8, 5, 3, 2, 1, 1, 1] },
  { day: 'Tue', hours: [1, 0, 0, 1, 2, 4, 9, 14, 16, 20, 15, 12, 10, 8, 14, 16, 11, 9, 6, 4, 3, 2, 1, 0] },
  { day: 'Wed', hours: [1, 1, 0, 0, 1, 3, 7, 11, 14, 17, 13, 10, 8, 6, 11, 14, 9, 7, 4, 2, 1, 1, 0, 1] },
  { day: 'Thu', hours: [2, 0, 1, 0, 2, 5, 10, 15, 18, 22, 16, 13, 11, 9, 15, 18, 12, 10, 7, 5, 4, 2, 1, 1] },
  { day: 'Fri', hours: [1, 1, 0, 1, 1, 3, 6, 10, 13, 16, 12, 9, 7, 5, 10, 13, 8, 6, 3, 2, 1, 0, 0, 0] },
  { day: 'Sat', hours: [0, 0, 0, 0, 0, 1, 2, 3, 5, 7, 5, 4, 3, 2, 4, 5, 3, 2, 1, 0, 0, 0, 0, 0] },
  { day: 'Sun', hours: [0, 0, 0, 0, 0, 0, 1, 2, 4, 6, 4, 3, 2, 1, 3, 4, 2, 1, 0, 0, 0, 0, 0, 0] },
];

const anomalies = [
  { title: 'Impossible travel detected', detail: '3 users', severity: 'high', icon: AlertTriangle },
  { title: 'Sudden fail spike from ASN 64500', detail: '45 attempts in 5 minutes', severity: 'high', icon: TrendingUp },
  { title: '12 attempts from blocked country', detail: 'Russia (RU)', severity: 'medium', icon: Globe },
  { title: '1 admin login outside business hours', detail: '02:30 AM login', severity: 'low', icon: Clock },
];

export function AuthSecurityView({ userRole }: AuthSecurityViewProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<string>('all');
  const [selectedMfaMethod, setSelectedMfaMethod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<typeof authEvents[0] | null>(null);
  const [showInvestigateDrawer, setShowInvestigateDrawer] = useState(false);
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ day: string; hour: number } | null>(null);

  const handleInvestigate = (event: typeof authEvents[0]) => {
    setSelectedEvent(event);
    setShowInvestigateDrawer(true);
  };

  const handleRevokeSession = (user: string) => {
    toast.success(`Session revoked for ${user}`);
  };

  const handleBlockIP = (ip: string) => {
    toast.warning(`IP ${ip} has been blocked`);
  };

  const handleRotateKey = (keyName: string) => {
    toast.success(`API key "${keyName}" rotation initiated`);
  };

  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-neutral-100 dark:bg-neutral-800';
    if (value <= 5) return 'bg-success-100 dark:bg-success-900/20';
    if (value <= 10) return 'bg-warning-100 dark:bg-warning-900/20';
    if (value <= 15) return 'bg-warning-500/30 dark:bg-warning-500/20';
    return 'bg-error-500/40 dark:bg-error-500/30';
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      Low: 'bg-success-100 text-success-700 border-success-200',
      Medium: 'bg-warning-100 text-warning-700 border-warning-200',
      High: 'bg-error-100 text-error-700 border-error-200',
    };
    return colors[risk as keyof typeof colors] || colors.Low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Authentication & Security</h2>
        <p className="text-muted-foreground">
          Manage user access, MFA, and security events
          {userRole === 'SystemAdmin' && ' (Tenant scope only)'}
        </p>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Separator orientation="vertical" className="h-8" />

          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="sso">SSO</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedResult} onValueChange={setSelectedResult}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMfaMethod} onValueChange={setSelectedMfaMethod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="MFA Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="totp">TOTP</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="fido2">FIDO2</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Events
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Open Policies
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">MFA Enrollment</p>
              <p className="text-foreground">87%</p>
            </div>
            <Sparkline data={[82, 83, 84, 85, 86, 87]} height={32}/>
          </div>
          <div className="flex items-center gap-1 text-xs text-success-700">
            <TrendingUp className="h-3 w-3" />
            <span>+3% MoM</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Failed Logins (24h)</p>
              <p className="text-foreground">23</p>
            </div>
            <Sparkline data={[45, 38, 35, 32, 28, 23]} height={32}/>
          </div>
          <div className="flex items-center gap-1 text-xs text-success-700">
            <TrendingDown className="h-3 w-3" />
            <span>-12%</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Locked Accounts</p>
              <p className="text-foreground">4</p>
            </div>
            <Sparkline data={[6, 5, 5, 4, 4, 4]} height={32}/>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Active Sessions</p>
              <p className="text-foreground">312</p>
            </div>
            <Sparkline data={[285, 295, 302, 308, 310, 312]} height={32}/>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">SSO Adoption</p>
              <p className="text-foreground">61%</p>
            </div>
            <Sparkline data={[52, 54, 56, 58, 60, 61]} height={32}/>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Password Resets (24h)</p>
              <p className="text-foreground">58</p>
            </div>
            <Sparkline data={[62, 60, 58, 56, 57, 58]} height={32}/>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ChartCard
            title="Login Activity & MFA Challenges"
            timeframe="Last 7 days"
            info="Tracks successful vs failed logins with MFA challenge overlay"
          >
            <ColumnChart
              data={loginOutcomeData}
              dataKeys={['success', 'failed', 'mfaChallenges']}
              colors={['var(--chart-2)', 'var(--chart-4)', 'var(--chart-1)']}
              stacked={false}
              height={280}
            />
          </ChartCard>
        </div>

        <ChartCard
          title="MFA Method Distribution"
          info="Breakdown of multi-factor authentication methods in use"
        >

          <div style={{ height: "280px" }}>
            <DonutChart
              data={mfaMethodData}

              centerLabel={mfaMethodData[0].name}
              centerSubtitle={`${Math.round(
                (mfaMethodData[0].value /
                  mfaMethodData.reduce((a, b) => a + b.value, 0)) *
                  100
              )}%`}
            />
          </div>
        </ChartCard>
      </div>

      {/* Heatmap + Alerts Row */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Failed Login Heatmap</h3>
          <p className="text-sm text-muted-foreground mb-4">Failed login attempts by hour and day</p>
          <div className="space-y-1">
            {heatmapData.map((row) => (
              <div key={row.day} className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground w-8">{row.day}</span>
                <div className="flex gap-0.5 flex-1">
                  {row.hours.map((value, idx) => (
                    <button
                      key={idx}
                      className={`h-6 flex-1 rounded-sm transition-all hover:ring-2 hover:ring-primary/50 ${getHeatmapColor(value)}`}
                      onClick={() => {
                        setSelectedHeatmapCell({ day: row.day, hour: idx });
                        toast.info(`${row.day} ${idx}:00 - ${value} failed attempts`);
                      }}
                      title={`${row.day} ${idx}:00 - ${value} failed attempts`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:00</span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-success-100" />
              <span>1-5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-warning-100" />
              <span>6-10</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-sm bg-error-500/40" />
              <span>15+</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Anomalies & Alerts</h3>
          <div className="space-y-3">
            {anomalies.map((anomaly, idx) => {
              const Icon = anomaly.icon;
              return (
                <Card key={idx} className="p-3 border-l-4" style={{
                  borderLeftColor: anomaly.severity === 'high' ? 'var(--error-500)' :
                                   anomaly.severity === 'medium' ? 'var(--warning-500)' :
                                   'var(--info-500)'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="h-5 w-5 mt-0.5" style={{
                        color: anomaly.severity === 'high' ? 'var(--error-500)' :
                               anomaly.severity === 'medium' ? 'var(--warning-500)' :
                               'var(--info-500)'
                      }} />
                      <div className="flex-1">
                        <p className="mb-1">{anomaly.title}</p>
                        <p className="text-sm text-muted-foreground">{anomaly.detail}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Auth Events Table */}
      <Card className="p-6">
        <h3 className="mb-4">Recent Authentication Events</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Geo</TableHead>
              <TableHead>Device/OS</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authEvents.map((event, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-sm">{event.time}</TableCell>
                <TableCell className="text-sm">{event.user}</TableCell>
                <TableCell className="text-sm">{event.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{event.provider}</Badge>
                </TableCell>
                <TableCell className="text-sm">{event.action}</TableCell>
                <TableCell>
                  <Badge className={event.result === 'Success' ? 'bg-success-100 text-success-700 border-success-200' : 'bg-error-100 text-error-700 border-error-200'} variant="outline">
                    {event.result}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-mono text-xs">{event.ip}</TableCell>
                <TableCell className="text-sm">{event.geo}</TableCell>
                <TableCell className="text-sm">{event.device}</TableCell>
                <TableCell>
                  <Badge className={getRiskBadge(event.risk)} variant="outline">
                    {event.risk}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleInvestigate(event)}>
                        Investigate
                      </DropdownMenuItem>
                      <DropdownMenuItem>Lock account</DropdownMenuItem>
                      <DropdownMenuItem>Require MFA reset</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBlockIP(event.ip)}>
                        Block IP
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Sessions & RBAC Changes Row */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Active Sessions</h3>
            <Button variant="outline" size="sm">
              Revoke All
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm">{session.user}</TableCell>
                  <TableCell className="text-sm">{session.device}</TableCell>
                  <TableCell className="text-sm font-mono text-xs">{session.ip}</TableCell>
                  <TableCell className="text-sm">{session.created}</TableCell>
                  <TableCell className="text-sm">{session.lastActivity}</TableCell>
                  <TableCell>
                    {session.mfa ? (
                      <CheckCircle2 className="h-4 w-4 text-success-500" />
                    ) : (
                      <X className="h-4 w-4 text-error-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRevokeSession(session.user)}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">RBAC Changes Audit</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rbacChanges.map((change, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm">{change.time}</TableCell>
                  <TableCell className="text-sm">{change.actor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{change.change}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{change.target}</TableCell>
                  <TableCell className="text-sm">{change.tenant}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Policy Status Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3>Password Policy</h3>
              <p className="text-sm text-muted-foreground">3 of 5 checks passed</p>
            </div>
          </div>
          <Progress value={60} className="mb-3" />
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-500" />
              <span>Min 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-500" />
              <span>Uppercase required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-500" />
              <span>Number required</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-error-500" />
              <span>Special char required</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-error-500" />
              <span>90-day rotation</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Edit Policy
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-success-700" />
            </div>
            <div className="flex-1">
              <h3>MFA Policy</h3>
              <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                Active
              </Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm mb-4">
            <div>
              <p className="text-muted-foreground mb-1">Admin Users</p>
              <p>Required</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Staff Users</p>
              <p>Optional</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Grace Period</p>
              <p>7 days</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Edit Policy
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning-700" />
            </div>
            <div className="flex-1">
              <h3>Lockout Policy</h3>
              <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                Aligned
              </Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm mb-4">
            <div>
              <p className="text-muted-foreground mb-1">Failed Attempts</p>
              <p>5 attempts</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Lockout Duration</p>
              <p>15 minutes</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Reset Counter</p>
              <p>24 hours</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Edit Policy
          </Button>
        </Card>
      </div>

      {/* Integration Health */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>SSO (OIDC/SAML)</h3>
            <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
              Connected
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span>Azure AD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Metadata Refresh</span>
              <span>2h ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <span>187</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>SCIM Provisioning</h3>
            <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
              Sync OK
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sync</span>
              <span>2h ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Users Synced</span>
              <span>312</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Sync</span>
              <span>In 4h</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>SIEM / Webhooks</h3>
            <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
              Delivery 97%
            </Badge>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Events Sent (24h)</span>
              <span>1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failed</span>
              <span className="text-error-500">37</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Send Test Event
          </Button>
        </Card>
      </div>

      {/* Keys & Tokens + Security Score */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>API Keys & Tokens</h3>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </div>
          <div className="space-y-3">
            {apiKeys.map((key, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p>{key.name}</p>
                      {key.status === 'warning' && (
                        <Badge className="bg-warning-100 text-warning-700 border-warning-200" variant="outline">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{key.scope}</p>
                  </div>
                  {key.status === 'warning' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRotateKey(key.name)}
                    >
                      Rotate
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last used: {key.lastUsed}</span>
                  <span className={key.rotatesIn === 'Overdue' ? 'text-error-500' : ''}>
                    Rotates in: {key.rotatesIn}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">JWT Signing Key</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Key ID</span>
              <span className="font-mono text-xs">abc123xyz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algorithm</span>
              <span>RS256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Rotation</span>
              <span>Dec 15, 2025</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Security Score</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="var(--neutral-200)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="var(--success-500)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(86 / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl">86</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-500" />
              <div className="flex-1">
                <p className="text-sm">MFA coverage ≥ 80%</p>
                <p className="text-xs text-muted-foreground">87% enrolled</p>
              </div>
              <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                Pass
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-500" />
              <div className="flex-1">
                <p className="text-sm">Failed-login rate {'<'} 3%</p>
                <p className="text-xs text-muted-foreground">2.4% failure rate</p>
              </div>
              <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                Pass
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              <div className="flex-1">
                <p className="text-sm">Key rotation {'<'} 30d</p>
                <p className="text-xs text-muted-foreground">1 key overdue</p>
              </div>
              <Badge className="bg-warning-100 text-warning-700 border-warning-200" variant="outline">
                Warning
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-500" />
              <div className="flex-1">
                <p className="text-sm">SSO health OK</p>
                <p className="text-xs text-muted-foreground">Last sync 2h ago</p>
              </div>
              <Badge className="bg-success-100 text-success-700 border-success-200" variant="outline">
                Pass
              </Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Recommendations
          </Button>
        </Card>
      </div>

      {/* Investigate Drawer */}
      <Sheet open={showInvestigateDrawer} onOpenChange={setShowInvestigateDrawer}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Security Investigation</SheetTitle>
            <SheetDescription>
              Detailed event analysis and quick actions
            </SheetDescription>
          </SheetHeader>
          
          {selectedEvent && (
            <div className="mt-6 space-y-6">
              <Card className="p-4">
                <h4 className="mb-3">Event Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User</span>
                    <span>{selectedEvent.user}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action</span>
                    <span>{selectedEvent.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Result</span>
                    <Badge className={selectedEvent.result === 'Success' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}>
                      {selectedEvent.result}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address</span>
                    <span className="font-mono text-xs">{selectedEvent.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{selectedEvent.geo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Device</span>
                    <span>{selectedEvent.device}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <Badge className={getRiskBadge(selectedEvent.risk)}>
                      {selectedEvent.risk}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="mb-3">30-Day Activity Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-success-500" />
                    <span>145 successful logins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-error-500" />
                    <span>3 failed attempts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-warning-500" />
                    <span>12 MFA challenges</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <h4 className="mb-3">Quick Actions</h4>
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  handleRevokeSession(selectedEvent.user);
                  setShowInvestigateDrawer(false);
                }}>
                  <Unlock className="h-4 w-4 mr-2" />
                  Revoke All Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  handleBlockIP(selectedEvent.ip);
                  setShowInvestigateDrawer(false);
                }}>
                  <Lock className="h-4 w-4 mr-2" />
                  Block IP Address
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force MFA Re-enrollment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Event Log
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
