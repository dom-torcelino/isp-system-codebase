"use client"; // Why: Marks this as a Client Component to enable the useRouter hook.

import { useRouter } from 'next/navigation'; // Why: Next.js native router.
import { Card } from './ui/card';
import { Button } from './ui/button';
import { KPICard } from './KPICard';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ChartCard, LineChart, ColumnChart, DonutChart, AreaChart } from './charts';
import {
  sampleTickets,
  ticketsByStatus,
  billingDistribution,
  churnRiskData,
  mrrTrend,
  auditEvents,
  integrationStatus,
  technicianJobs,
  sparklineData,
  currentTicketBreakdown,
} from '../lib/sample-data';
import { MoreVertical, MapPin, Plus, FileText, Shield, TrendingUp, Ticket as TicketIcon } from 'lucide-react';
import { MapPlaceholder } from './MapPlaceholder';
import { UserRole } from '../types';

// Why: Remove onNavigate from the interface.
interface OverviewDashboardProps {
  userRole: UserRole;
}

export function OverviewDashboard({ userRole }: OverviewDashboardProps) {
  const router = useRouter(); // Why: Initialize the Next.js router.
  const canAccessRevenue = userRole === 'SuperAdmin';

  // Why: Create a helper function to replace the missing prop, keeping your JSX clean.
  const onNavigate = (path: string) => {
    router.push(`/${path}`);
  };

  return (
    <div className="space-y-6">
      {/* KPI Header Row */}
      <div className="grid grid-cols-6 gap-4">
        <KPICard
          title="Total Tenants"
          value={128}
          change="+8%"
          trend="up"
          sparklineData={sparklineData.tenants}
          onClick={() => onNavigate('tenants')}
        />
        <KPICard
          title="Active Customers"
          value="42,310"
          change="+2.1%"
          trend="up"
          sparklineData={sparklineData.customers}
          onClick={() => onNavigate('crm')}
        />
        <KPICard
          title="Tickets Open"
          value={412}
          change="-5%"
          trend="down"
          sparklineData={sparklineData.tickets}
        />
        <KPICard
          title="SLA At Risk"
          value={37}
          change="-12%"
          trend="down"
          sparklineData={sparklineData.slaRisk}
        />
        <KPICard
          title="MRR (PHP)"
          value="₱21.8M"
          change="+4.5%"
          trend="up"
          sparklineData={sparklineData.mrr}
          onClick={() => canAccessRevenue && onNavigate('revenue')}
        />
        <KPICard
          title="Overdue Invoices"
          value={1142}
          change="+3%"
          trend="up"
          sparklineData={sparklineData.overdue}
          onClick={() => onNavigate('billing')}
        />
      </div>

      {/* Row B: Ticketing + Technician Operations */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>Ticketing & Repair — Work in Progress</h3>
                <p className="text-sm text-muted-foreground">Current status breakdown</p>
              </div>
              <Button onClick={() => onNavigate('tickets')} size="sm">
                <TicketIcon className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>

            {/* Stacked Bar Chart */}
            <div className="mb-6">
              <div className="flex items-center gap-6 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-3" />
                  <span className="text-sm">Pending: {currentTicketBreakdown.Pending}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-1" />
                  <span className="text-sm">Ongoing: {currentTicketBreakdown.Ongoing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-chart-4" />
                  <span className="text-sm">Escalated: {currentTicketBreakdown.Escalated}</span>
                </div>
              </div>
              <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                <div
                  className="bg-chart-3 flex items-center justify-center transition-all hover:opacity-80"
                  style={{
                    width: `${(currentTicketBreakdown.Pending / (currentTicketBreakdown.Pending + currentTicketBreakdown.Ongoing + currentTicketBreakdown.Escalated)) * 100}%`,
                  }}
                >
                  <span className="text-sm font-medium text-white">{currentTicketBreakdown.Pending}</span>
                </div>
                <div
                  className="bg-chart-1 flex items-center justify-center transition-all hover:opacity-80"
                  style={{
                    width: `${(currentTicketBreakdown.Ongoing / (currentTicketBreakdown.Pending + currentTicketBreakdown.Ongoing + currentTicketBreakdown.Escalated)) * 100}%`,
                  }}
                >
                  <span className="text-sm font-medium text-white">{currentTicketBreakdown.Ongoing}</span>
                </div>
                <div
                  className="bg-chart-4 flex items-center justify-center transition-all hover:opacity-80"
                  style={{
                    width: `${(currentTicketBreakdown.Escalated / (currentTicketBreakdown.Pending + currentTicketBreakdown.Ongoing + currentTicketBreakdown.Escalated)) * 100}%`,
                  }}
                >
                  <span className="text-sm font-medium text-white">{currentTicketBreakdown.Escalated}</span>
                </div>
              </div>
            </div>

            {/* 7-day trend chart */}
            <div className="h-[160px]">
              <ColumnChart
                data={ticketsByStatus}
                xKey="name"
                bars={[
                  { key: 'Pending', label: 'Pending', color: 'var(--chart-3)' },
                  { key: 'Ongoing', label: 'Ongoing', color: 'var(--chart-1)' },
                  { key: 'Escalated', label: 'Escalated', color: 'var(--chart-4)' },
                ]}
                unit="count"
              />
            </div>
          </Card>
          
          {/* Ticket table below chart */}
          <Card className="p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h4>Oldest Pending Tickets</h4>
              <Button variant="outline" size="sm" onClick={() => onNavigate('tickets')}>
                View All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>SLA ETA</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleTickets.slice(0, 5).map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.priority as any} />
                    </TableCell>
                    <TableCell>{ticket.age}</TableCell>
                    <TableCell className={ticket.slaEta === 'Overdue' ? 'text-destructive' : ''}>
                      {ticket.slaEta}
                    </TableCell>
                    <TableCell>{ticket.assignee}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Technician Operations</h3>
              <p className="text-sm text-muted-foreground">Live field activity</p>
            </div>
          </div>

          <div className="mb-4 h-[120px]">
            <MapPlaceholder />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">On duty</p>
              <p className="text-xl font-bold text-foreground">58<span className="text-sm text-muted-foreground font-normal">/72</span></p>
            </div>
            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">On-time SLA</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-500">92%</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-accent/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg travel time</p>
            <p className="text-lg font-medium">28 min</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm">Next 5 jobs</h4>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('technicians')}>
                View all
              </Button>
            </div>
            {technicianJobs.slice(0, 4).map((job, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm p-2 bg-accent/30 rounded-md">
                <span className="font-medium">{job.time}</span>
                <span className="text-muted-foreground text-xs">{job.area}</span>
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                  {job.tech}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row C: Billing, CRM, Compliance */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3>Billing & Payments</h3>
            <p className="text-sm text-muted-foreground">Current period</p>
          </div>

          <div className="h-[160px] mb-4">
            <DonutChart
              data={billingDistribution}
              // nameKey="name"
              // valueKey="value"
            />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue MTD</span>
              <span>₱7.2M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overdue</span>
              <span className="text-destructive">₱1.08M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disputes</span>
              <span>83</span>
            </div>
          </div>

          <Button className="w-full" onClick={() => onNavigate('billing')}>
            <FileText className="h-4 w-4 mr-2" />
            Generate invoices
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3>CRM / Customer Health</h3>
            <p className="text-sm text-muted-foreground">Customer segments</p>
          </div>

          <div className="h-[160px] mb-4">
            <ColumnChart
              data={churnRiskData}
              xKey="segment"
              bars={[
                { key: 'count', label: 'Count', color: 'var(--chart-3)' },
              ]}
              // unit="customers"
              unit='count'
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-muted-foreground">VIPs</p>
              <p>612</p>
            </div>
            <div>
              <p className="text-muted-foreground">New signups</p>
              <p>380</p>
            </div>
            <div>
              <p className="text-muted-foreground">CSAT</p>
              <p>4.3/5</p>
            </div>
            <div>
              <p className="text-muted-foreground">NPS</p>
              <p>+37</p>
            </div>
          </div>

          <Button className="w-full" variant="outline" onClick={() => onNavigate('crm')}>
            Open CRM dashboards
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3>Compliance & Audit</h3>
            <p className="text-sm text-muted-foreground">Recent events</p>
          </div>

          <div className="space-y-2 mb-4 max-h-[160px] overflow-y-auto">
            {auditEvents.map((event, idx) => (
              <div key={idx} className="p-2 bg-accent/30 rounded text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span>{event.event}</span>
                  <span className="text-muted-foreground">{event.time}</span>
                </div>
                <p className="text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">RA 10173</span>
              <StatusBadge status="Active" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NTC retention</span>
              <StatusBadge status="Active" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Backup</span>
              <span className="text-muted-foreground">3 hrs ago</span>
            </div>
          </div>

          <Button className="w-full" variant="outline" onClick={() => onNavigate('compliance')}>
            <Shield className="h-4 w-4 mr-2" />
            Open compliance center
          </Button>
        </Card>
      </div>

      {/* Row D: Revenue & Integrations */}
      {canAccessRevenue && (
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>Revenue & Monetization</h3>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Button onClick={() => onNavigate('revenue')} size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Manage subscriptions
              </Button>
            </div>

            <div className="h-[180px] mb-4">
              <LineChart
                data={mrrTrend}
                xKey="month"
                lines={[
                  { key: 'MRR', label: 'MRR', color: 'var(--chart-1)' },
                  { key: 'ARPU', label: 'ARPU', color: 'var(--chart-3)' },
                ]}
                // unit="PHP"
                unit='currency'
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-muted-foreground">ARPU</p>
                <p>₱517</p>
              </div>
              <div>
                <p className="text-muted-foreground">Churn</p>
                <p>1.3%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Active tenants</p>
                <p>128</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trials</p>
                <p>9</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <h3>Integration & Scalability</h3>
              <p className="text-sm text-muted-foreground">System status</p>
            </div>

            <div className="space-y-3 mb-4">
              {integrationStatus.map((integration, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{integration.name}</span>
                  </div>
                  <span className="text-muted-foreground">{integration.status}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-accent/30 rounded mb-4">
              <p className="text-muted-foreground">API usage</p>
              <p>12.4k calls/day</p>
              <p className="text-sm text-muted-foreground">3% errors</p>
            </div>

            <Button className="w-full" variant="outline" onClick={() => onNavigate('integrations')}>
              Manage integrations
            </Button>
          </Card>
        </div>
      )}

      {/* Row E: Reports & Analytics */}
      <Card className="p-6">
        <div className="mb-4">
          <h3>Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Export center & predictive insights</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Export CSV/Excel/PDF</h4>
            <p className="text-muted-foreground mb-3">
              Generate reports for customers, billing, tickets, and technicians
            </p>
            <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
              Run export
            </Button>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Churn 30-day forecast</h4>
            <p className="text-muted-foreground mb-3">
              Predict customer churn risk using ML models
            </p>
            <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
              View forecast
            </Button>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">SLA breach risk</h4>
            <p className="text-muted-foreground mb-3">
              Identify tickets at risk of missing SLA deadlines
            </p>
            <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
              View analysis
            </Button>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Ticket routing</h4>
            <p className="text-muted-foreground mb-3">
              AI-powered recommendations for optimal technician assignment
            </p>
            <Button variant="outline" size="sm" onClick={() => onNavigate('reports')}>
              See recommendations
            </Button>
          </div>
        </div>
      </Card>

      {/* Row F: Customer Portal */}
      <Card className="p-6">
        <div className="mb-4">
          <h3>Customer Portal</h3>
          <p className="text-sm text-muted-foreground">Self-service metrics & announcements</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-4">
          <div>
            <p className="text-muted-foreground">Daily active customers</p>
            <p>7.2k</p>
          </div>
          <div>
            <p className="text-muted-foreground">Top action</p>
            <p>View billing</p>
          </div>
          <div>
            <p className="text-muted-foreground">Survey completion</p>
            <p>62%</p>
          </div>
          <div>
            <Button variant="outline" onClick={() => onNavigate('portal')}>
              Manage portal
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-blue-900 mb-1">Scheduled maintenance</h4>
          <p className="text-blue-700">
            Network upgrade in Makati area on Oct 22, 2:00 AM - 6:00 AM. Service may be briefly interrupted.
          </p>
        </div>
      </Card>
    </div>
  );
}