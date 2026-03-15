import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { StatusBadge } from './StatusBadge';
import { UserRole } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Users, Star, AlertTriangle, UserPlus, TrendingDown } from 'lucide-react';
import { sampleCustomers } from '../lib/sample-data';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartCard } from './charts/ChartCard';
import { StackedAreaChart } from './charts/StackedAreaChart';
import { DonutChart } from './charts/DonutChart';
import { CreateCustomerDrawer } from './CreateCustomerDrawer';
import { toast } from 'sonner';

interface CRMViewProps {
  userRole: UserRole;
}

const churnRiskTrend = [
  { month: 'May', Low: 15500, Medium: 4200, High: 1500 },
  { month: 'Jun', Low: 15400, Medium: 4400, High: 1450 },
  { month: 'Jul', Low: 15300, Medium: 4600, High: 1400 },
  { month: 'Aug', Low: 15250, Medium: 4700, High: 1380 },
  { month: 'Sep', Low: 15220, Medium: 4750, High: 1350 },
  { month: 'Oct', Low: 15200, Medium: 4800, High: 1320 },
];

const customerSegmentsData = [
  { name: 'VIP', value: 612, color: 'hsl(var(--chart-3))' },
  { name: 'At Risk', value: 1320, color: 'hsl(var(--chart-4))' },
  { name: 'New', value: 380, color: 'hsl(var(--chart-1))' },
  { name: 'Delinquent', value: 142, color: 'hsl(var(--chart-5))' },
];

const complaintRate = [
  { week: 'W1', complaints: 28, resolved: 25 },
  { week: 'W2', complaints: 32, resolved: 30 },
  { week: 'W3', complaints: 26, resolved: 24 },
  { week: 'W4', complaints: 22, resolved: 21 },
];

export function CRMView({ userRole }: CRMViewProps) {
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false);
  const [vipCount, setVipCount] = useState(612);
  const [newSignupsCount, setNewSignupsCount] = useState(380);
  const [newCustomers, setNewCustomers] = useState<any[]>([]);

  const handleCreateCustomer = (customer: any) => {
    // Close drawer
    setCreateCustomerOpen(false);
    
    // Show success toast
    toast.success('Customer created', {
      description: `${customer.name} has been added to your CRM`,
    });
    
    // Update KPIs
    setNewSignupsCount(prev => prev + 1);
    if (customer.isVIP) {
      setVipCount(prev => prev + 1);
    }
    
    // Add to new customers list (for table highlighting)
    const newCustomer = {
      id: `C${Date.now()}`,
      name: customer.name,
      email: customer.email,
      city: customer.city || 'N/A',
      plan: customer.plan,
      tags: [
        ...(customer.isVIP ? ['VIP'] : []),
        ...(customer.churnRisk === 'High' || customer.churnRisk === 'Medium' ? ['ChurnRisk'] : []),
        'New',
      ],
      tenure: '0m',
      balance: 0,
      isNew: true,
    };
    setNewCustomers([newCustomer]);
  };

  const atRiskTotal = 1320;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Customer Management (CRM)</h2>
          <p className="text-muted-foreground">Customer health, segmentation, and relationship tracking</p>
        </div>
        <Button onClick={() => setCreateCustomerOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create customer
        </Button>
      </div>

      {/* Customer Health KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-500" />
            <p className="text-muted-foreground">VIP Customers</p>
          </div>
          <p className="text-foreground">{vipCount}</p>
          <p className="text-sm text-muted-foreground">1.4% of total</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-muted-foreground">Churn Risk</p>
          </div>
          <p className="text-destructive">{atRiskTotal}</p>
          <p className="text-sm text-green-600">-30 vs last month</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-muted-foreground">New Signups</p>
          </div>
          <p className="text-foreground">{newSignupsCount}</p>
          <p className="text-sm text-green-600">+12% MoM</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">CSAT Score</p>
          <p className="text-foreground">4.3/5.0</p>
          <p className="text-sm text-green-600">+0.2 vs last month</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">NPS</p>
          <p className="text-foreground">+37</p>
          <p className="text-sm text-green-600">+5 points MoM</p>
        </Card>
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'VIP', count: 612, color: 'bg-amber-100 border-amber-300 text-amber-800' },
          { label: 'At Risk', count: 1320, color: 'bg-red-100 border-red-300 text-red-800' },
          { label: 'New', count: 380, color: 'bg-blue-100 border-blue-300 text-blue-800' },
          { label: 'Delinquent', count: 142, color: 'bg-gray-100 border-gray-300 text-gray-800' },
        ].map((segment) => (
          <Card
            key={segment.label}
            className={`p-4 border-2 cursor-pointer hover:shadow-md transition-shadow ${segment.color}`}
          >
            <p className="mb-2">{segment.label}</p>
            <p className="text-foreground">{segment.count} customers</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Churn Risk Trend - Stacked Area */}
        <ChartCard
          title="Churn Risk by Segment"
          timeframe="Last 6 months"
          info="Track customer churn risk trends over time by risk level"
          footer={
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{atRiskTotal} At Risk</Badge>
              <span className="text-sm text-muted-foreground">Total high + medium risk customers</span>
            </div>
          }
        >
          <StackedAreaChart
            data={churnRiskTrend}
            xKey="month"
            areas={[
              { key: 'Low', label: 'Low Risk', color: 'hsl(var(--chart-2))' },
              { key: 'Medium', label: 'Medium Risk', color: 'hsl(var(--chart-3))' },
              { key: 'High', label: 'High Risk', color: 'hsl(var(--chart-4))' },
            ]}
            unit="count"
          />
        </ChartCard>

        {/* Customer Segments - Donut */}
        <ChartCard
          title="Customer Segments Today"
          info="Current distribution of customers by segment"
        >
          <DonutChart
            data={customerSegmentsData}
            unit="count"
            centerLabel={customerSegmentsData[0].name}
            centerSubtitle={`${((customerSegmentsData[0].value / customerSegmentsData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%`}
          />
        </ChartCard>
      </div>

      {/* Complaint Tracking */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Weekly Complaint Rate</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complaintRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="hsl(var(--chart-5))" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800">Resolution rate: 95.7% (90 of 94 complaints this month)</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Customer Engagement Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Tag as VIP
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingDown className="h-4 w-4 mr-2" />
              Run churn prediction
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Run CSAT survey
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Run NPS survey
            </Button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-900 mb-1">Automation Tip</p>
            <p className="text-blue-700 text-sm">
              Enable auto-tagging for VIP customers spending &gt;₱5,000/month
            </p>
          </div>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Customer Directory</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Show new customers first */}
            {newCustomers.map((customer) => (
              <TableRow key={customer.id} className="bg-primary/5 border-l-4 border-l-primary">
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {customer.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={
                          tag === 'VIP'
                            ? 'bg-amber-100 text-amber-800'
                            : tag === 'ChurnRisk'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {tag === 'ChurnRisk' ? 'At Risk' : tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{customer.tenure}</TableCell>
                <TableCell>
                  {customer.balance > 0 ? (
                    <span className="text-destructive">₱{customer.balance.toLocaleString()}</span>
                  ) : (
                    <span className="text-green-600">₱0</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
            
            {sampleCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {customer.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={
                          tag === 'VIP'
                            ? 'bg-amber-100 text-amber-800'
                            : tag === 'ChurnRisk'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {tag === 'ChurnRisk' ? 'At Risk' : tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{customer.tenure}</TableCell>
                <TableCell>
                  {customer.balance > 0 ? (
                    <span className="text-destructive">₱{customer.balance.toLocaleString()}</span>
                  ) : (
                    <span className="text-green-600">₱0</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Customer Drawer */}
      <CreateCustomerDrawer
        open={createCustomerOpen}
        onOpenChange={setCreateCustomerOpen}
        onSuccess={handleCreateCustomer}
      />
    </div>
  );
}
