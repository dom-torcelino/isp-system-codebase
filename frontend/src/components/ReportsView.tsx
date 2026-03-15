import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  Zap,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';
import { UserRole } from '../types';

interface ReportsViewProps {
  userRole: UserRole;
}

const reportCategories = [
  {
    title: 'Customer Reports',
    icon: FileText,
    reports: [
      { name: 'Customer List', format: 'CSV/Excel', lastRun: '2h ago' },
      { name: 'Customer Segmentation', format: 'PDF', lastRun: '1d ago' },
      { name: 'Churn Analysis', format: 'Excel', lastRun: '3d ago' },
      { name: 'New Signups', format: 'CSV', lastRun: '5d ago' },
    ],
  },
  {
    title: 'Billing Reports',
    icon: FileSpreadsheet,
    reports: [
      { name: 'Revenue Summary', format: 'PDF/Excel', lastRun: '1h ago' },
      { name: 'Overdue Invoices', format: 'CSV', lastRun: '4h ago' },
      { name: 'Payment Collections', format: 'Excel', lastRun: '1d ago' },
      { name: 'Aging Report', format: 'PDF', lastRun: '2d ago' },
    ],
  },
  {
    title: 'Ticketing Reports',
    icon: FileText,
    reports: [
      { name: 'Ticket Volume by Category', format: 'PDF', lastRun: '3h ago' },
      { name: 'SLA Compliance', format: 'Excel', lastRun: '1d ago' },
      { name: 'Escalation Rate', format: 'CSV', lastRun: '2d ago' },
      { name: 'Resolution Time', format: 'PDF', lastRun: '3d ago' },
    ],
  },
  {
    title: 'Technician Reports',
    icon: FileText,
    reports: [
      { name: 'Performance by Technician', format: 'Excel', lastRun: '6h ago' },
      { name: 'Job Completion Rate', format: 'PDF', lastRun: '1d ago' },
      { name: 'Travel Time Analysis', format: 'CSV', lastRun: '2d ago' },
      { name: 'First-time Fix Rate', format: 'Excel', lastRun: '3d ago' },
    ],
  },
];

const predictiveInsights = [
  {
    title: '30-Day Churn Forecast',
    icon: TrendingUp,
    description: 'ML-powered prediction of customer churn risk',
    risk: 'Medium',
    action: 'View 142 at-risk customers',
  },
  {
    title: 'SLA Breach Risk',
    icon: AlertTriangle,
    description: 'Identify tickets likely to miss SLA deadlines',
    risk: 'High',
    action: 'View 37 tickets at risk',
  },
  {
    title: 'Ticket Routing Recommendation',
    icon: Zap,
    description: 'AI-powered technician assignment optimization',
    risk: 'Low',
    action: 'View recommendations',
  },
  {
    title: 'Revenue Leakage Detection',
    icon: TrendingUp,
    description: 'Identify billing discrepancies and missed charges',
    risk: 'Medium',
    action: 'View ₱82k potential recovery',
  },
];

export function ReportsView({ userRole }: ReportsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate insights, export data, and run predictive analytics
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Schedule report
        </Button>
      </div>

      {/* Quick Export */}
      <Card className="p-6">
        <h3 className="mb-4">Quick Export</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Report Type</label>
            <Select defaultValue="customers">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customers">Customer List</SelectItem>
                <SelectItem value="billing">Billing Summary</SelectItem>
                <SelectItem value="tickets">Ticket Report</SelectItem>
                <SelectItem value="technicians">Technician Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Date Range</label>
            <Select defaultValue="30d">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Format</label>
            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (XLSX)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Predictive Insights */}
      <div>
        <h3 className="mb-4">Predictive Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          {predictiveInsights.map((insight, idx) => {
            const IconComponent = insight.icon;
            const riskColor =
              insight.risk === 'High'
                ? 'bg-red-100 border-red-300 text-red-800'
                : insight.risk === 'Medium'
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-green-100 border-green-300 text-green-800';

            return (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4>{insight.title}</h4>
                      <Badge variant="secondary" className={riskColor}>
                        {insight.risk} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {insight.action}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-2 gap-6">
        {reportCategories.map((category, idx) => {
          const IconComponent = category.icon;
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="h-5 w-5 text-muted-foreground" />
                <h3>{category.title}</h3>
              </div>

              <div className="space-y-3">
                {category.reports.map((report, reportIdx) => (
                  <div
                    key={reportIdx}
                    className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p>{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.format} · Last run: {report.lastRun}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3>Scheduled Reports</h3>
          </div>
          <Button variant="outline" size="sm">Manage schedules</Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div>
              <p>Weekly Revenue Summary</p>
              <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM · PDF</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div>
              <p>Monthly SLA Compliance Report</p>
              <p className="text-sm text-muted-foreground">1st of month at 10:00 AM · Excel</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div>
              <p>Daily Overdue Invoices</p>
              <p className="text-sm text-muted-foreground">Every day at 8:00 AM · CSV</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
