import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { sampleTenants } from '../lib/sample-data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart as RechartsAreaChart,
} from 'recharts';
import { Alert, AlertDescription } from './ui/alert';
import { Lock } from 'lucide-react';
import { UserRole } from '../types';
import { ChartCard } from './charts/ChartCard';
import { ManageSubscriptionsFlow } from './ManageSubscriptionsFlow';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

const mrrTrend = [
  { month: 'May', MRR: 19200, ARPU: 485, Churn: 1.8 },
  { month: 'Jun', MRR: 19800, ARPU: 492, Churn: 1.6 },
  { month: 'Jul', MRR: 20400, ARPU: 498, Churn: 1.5 },
  { month: 'Aug', MRR: 20800, ARPU: 505, Churn: 1.4 },
  { month: 'Sep', MRR: 21200, ARPU: 512, Churn: 1.4 },
  { month: 'Oct', MRR: 21800, ARPU: 517, Churn: 1.3 },
];

interface RevenueViewProps {
  userRole: UserRole;
}

export function RevenueView({ userRole }: RevenueViewProps) {
  // Only SuperAdmin has access
  const hasAccess = userRole === 'SuperAdmin';
  const [manageSubsOpen, setManageSubsOpen] = useState(false);
  const [mrr, setMrr] = useState(21800000);
  const [arpu, setArpu] = useState(517);
  
  const handleManageSubsSuccess = () => {
    setManageSubsOpen(false);
    toast.success('Subscription updated', {
      description: 'The tenant subscription has been modified successfully',
    });
    
    // Update MRR/ARPU (simulated)
    setMrr(prev => prev + 85000);
    setArpu(prev => prev + 12);
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Card className="p-12 max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="mb-2">Access Restricted</h3>
          <p className="text-muted-foreground mb-6">
            Revenue & Monetization module requires Super Admin privileges. Your current role does not include this permission.
          </p>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access denied by RBAC policy. Contact your system administrator to request elevated access.
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Revenue & Monetization</h2>
          <p className="text-muted-foreground">Global SaaS metrics and tenant subscription management</p>
        </div>
        <Button onClick={() => setManageSubsOpen(true)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Manage subscriptions
        </Button>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground">MRR</p>
          <p className="text-foreground">₱{mrr.toLocaleString()}</p>
          <p className="text-sm text-green-600">+4.5% MoM</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">ARPU</p>
          <p className="text-foreground">₱{arpu}</p>
          <p className="text-sm text-green-600">+1.0% MoM</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">Monthly Churn</p>
          <p className="text-foreground">1.3%</p>
          <p className="text-sm text-green-600">-0.1% MoM</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">Active Tenants</p>
          <p className="text-foreground">128</p>
          <p className="text-sm text-muted-foreground">9 trials</p>
        </Card>
      </div>

      {/* MRR & ARPU Trend - Dual-series Line Chart with Light Area */}
      <ChartCard
        title="Revenue Trends"
        timeframe="Last 6 months"
        info="Monthly Recurring Revenue (MRR) and Average Revenue Per User (ARPU) trends"
        footer={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-1" />
              <span className="text-sm text-muted-foreground">MRR (₱1000s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-3" />
              <span className="text-sm text-muted-foreground">ARPU (₱)</span>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                Monthly churn: 1.3%
              </Badge>
            </div>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <RechartsAreaChart data={mrrTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.32}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="MRR"
              stroke="hsl(var(--chart-1))"
              fill="url(#colorMRR)"
              strokeWidth={2.5}
              name="MRR (₱1000s)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ARPU"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              name="ARPU (₱)"
              dot={{ r: 3 }}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tenant Health Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3>Tenant Subscription Overview</h3>
            <p className="text-muted-foreground">Monitor tenant activity and revenue health</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.plan}</TableCell>
                <TableCell>
                  <StatusBadge status={tenant.status} />
                </TableCell>
                <TableCell>₱{tenant.mrr.toLocaleString()}</TableCell>
                <TableCell>
                  {Math.floor(Math.random() * 5000) + 2000}
                </TableCell>
                <TableCell>
                  {Math.floor(Math.random() * 24)}h ago
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Healthy</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setManageSubsOpen(true)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Revenue Leakage & Expansion */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Revenue at Risk</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
              <div>
                <p>Trial conversion risk</p>
                <p className="text-sm text-muted-foreground">3 tenants ending in 7 days</p>
              </div>
              <p className="text-destructive">₱85k MRR</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <div>
                <p>Payment failures</p>
                <p className="text-sm text-muted-foreground">2 tenants with failed charges</p>
              </div>
              <p className="text-amber-700 dark:text-amber-400">₱45k MRR</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <div>
                <p>Downgrade requests</p>
                <p className="text-sm text-muted-foreground">1 tenant requesting lower plan</p>
              </div>
              <p className="text-blue-700 dark:text-blue-400">-₱40k MRR</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Expansion Opportunities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <div>
                <p>Upsell candidates</p>
                <p className="text-sm text-muted-foreground">12 tenants at 80%+ capacity</p>
              </div>
              <p className="text-green-700 dark:text-green-400">+₱420k potential</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
              <div>
                <p>Feature adoption</p>
                <p className="text-sm text-muted-foreground">8 tenants ready for premium features</p>
              </div>
              <p className="text-purple-700 dark:text-purple-400">+₱280k potential</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-900">
              <div>
                <p>Annual contracts</p>
                <p className="text-sm text-muted-foreground">5 tenants eligible for annual switch</p>
              </div>
              <p className="text-teal-700 dark:text-teal-400">+15% discount savings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Manage Subscriptions Flow */}
      <ManageSubscriptionsFlow
        open={manageSubsOpen}
        onOpenChange={setManageSubsOpen}
        onSuccess={handleManageSubsSuccess}
      />
    </div>
  );
}
