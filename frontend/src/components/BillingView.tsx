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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { FileText, Send, DollarSign, AlertCircle } from 'lucide-react';
import { sampleInvoices } from '../lib/sample-data';
import { UserRole } from '../types';
import { ChartCard } from './charts/ChartCard';
import { ColumnChart } from './charts/ColumnChart';
import { DonutChart } from './charts/DonutChart';
import { GenerateInvoicesFlow } from './GenerateInvoicesFlow';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface BillingViewProps {
  userRole: UserRole;
}

const overdueAging = [
  { range: '0-30 days', amount: 420000 },
  { range: '31-60 days', amount: 380000 },
  { range: '61-90 days', amount: 220000 },
  { range: '90+ days', amount: 122000 },
];

const invoiceStatusData = [
  { name: 'Paid', value: 15420, color: 'hsl(var(--chart-2))' },
  { name: 'Partial', value: 2180, color: 'hsl(var(--chart-3))' },
  { name: 'Overdue', value: 1142, color: 'hsl(var(--chart-4))' },
  { name: 'In Dispute', value: 83, color: 'hsl(var(--chart-5))' },
];

export function BillingView({ userRole }: BillingViewProps) {
  const isSupport = userRole === 'CustomerSupport';
  const [generateOpen, setGenerateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newInvoices, setNewInvoices] = useState<any[]>([]);

  const handleGenerateSuccess = (count: number) => {
    setGenerateOpen(false);
    toast.success(`${count} invoices generated`, {
      description: 'All invoices have been created and emails sent successfully',
    });
    
    // Switch to "All Invoices" tab
    setActiveTab('all');
    
    // Add mock new invoices
    const mockInvoices = [
      { id: `INV-2025-${1000 + count}`, customer: 'New Customer A', amount: 1500, status: 'Paid', dueDate: '2025-11-15', balance: 0, isNew: true },
      { id: `INV-2025-${1001 + count}`, customer: 'New Customer B', amount: 2200, status: 'Partial', dueDate: '2025-11-18', balance: 1100, isNew: true },
      { id: `INV-2025-${1002 + count}`, customer: 'New Customer C', amount: 1800, status: 'Paid', dueDate: '2025-11-20', balance: 0, isNew: true },
    ];
    setNewInvoices(mockInvoices);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Billing & Payments</h2>
          <p className="text-muted-foreground">
            Manage invoices, payments, and collections
            {isSupport && ' (Payments and disputes only)'}
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setGenerateOpen(true)}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4>Generate Invoices</h4>
              <p className="text-muted-foreground">Create monthly bills</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4>Resend Invoices</h4>
              <p className="text-muted-foreground">Email to customers</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4>Refunds & Disputes</h4>
              <p className="text-muted-foreground">Process claims</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4>Collections</h4>
              <p className="text-muted-foreground">Follow up overdue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground">Revenue MTD</p>
          <p className="text-foreground">₱7,200,000</p>
          <p className="text-sm text-green-600">+12% vs last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">Total Overdue</p>
          <p className="text-destructive">₱1,080,000</p>
          <p className="text-sm text-muted-foreground">1,142 invoices</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">In Dispute</p>
          <p className="text-foreground">₱245,000</p>
          <p className="text-sm text-muted-foreground">83 cases</p>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground">Collection Rate</p>
          <p className="text-foreground">94.2%</p>
          <p className="text-sm text-green-600">+2.1% MoM</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Overdue Aging - Column Chart */}
        <ChartCard
          title="Overdue Aging"
          info="Distribution of overdue amounts by aging buckets"
        >
          <ColumnChart
            data={overdueAging}
            xKey="range"
            bars={[
              { key: 'amount', label: 'Amount (₱)', color: 'hsl(var(--chart-4))' },
            ]}
            unit="currency"
            height={250}
          />
        </ChartCard>

        {/* Invoice Status - Donut Chart */}
        <ChartCard
          title="Invoice Status"
          info="Current distribution of invoices by status"
        >
          <DonutChart
            data={invoiceStatusData}
            unit="count"
            centerLabel={invoiceStatusData[0].name}
            centerSubtitle={`${((invoiceStatusData[0].value / invoiceStatusData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%`}
          />
        </ChartCard>
      </div>

      {/* Invoices Table */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="dispute">In Dispute</TabsTrigger>
            </TabsList>
            <Button onClick={() => setGenerateOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate invoices
            </Button>
          </div>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Show new invoices first */}
                {newInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="bg-primary/5 border-l-4 border-l-primary">
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>₱{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      {invoice.balance > 0 ? (
                        <span className="text-destructive">₱{invoice.balance.toLocaleString()}</span>
                      ) : (
                        <span>₱0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Send</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {sampleInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>₱{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      {invoice.balance > 0 ? (
                        <span className="text-destructive">₱{invoice.balance.toLocaleString()}</span>
                      ) : (
                        <span>₱0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Send</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="paid">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Showing paid invoices only</p>
            </div>
          </TabsContent>

          <TabsContent value="partial">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Showing partially paid invoices</p>
            </div>
          </TabsContent>

          <TabsContent value="overdue">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Showing overdue invoices</p>
            </div>
          </TabsContent>

          <TabsContent value="dispute">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Showing disputed invoices</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Generate Invoices Flow */}
      <GenerateInvoicesFlow
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        onSuccess={handleGenerateSuccess}
      />
    </div>
  );
}
