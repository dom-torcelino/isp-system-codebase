import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Globe, FileText, Ticket, CreditCard, MessageSquare, Megaphone } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserRole } from '../types';

interface CustomerPortalViewProps {
  userRole: UserRole;
}

const portalUsageData = [
  { action: 'View Billing', count: 2840 },
  { action: 'Create Ticket', count: 1920 },
  { action: 'Track Status', count: 1680 },
  { action: 'Pay Invoice', count: 1420 },
  { action: 'Complete Survey', count: 890 },
];

const recentCustomerActions = [
  { time: '5m ago', customer: 'Maria Santos', action: 'Viewed invoice INV-2025-0421' },
  { time: '12m ago', customer: 'Jose Cruz', action: 'Created ticket TRX-09326' },
  { time: '18m ago', customer: 'Ana Reyes', action: 'Paid invoice ₱1,800' },
  { time: '25m ago', customer: 'Pedro Aquino', action: 'Tracked ticket status' },
  { time: '32m ago', customer: 'Carmen Lopez', action: 'Completed CSAT survey' },
];

export function CustomerPortalView({ userRole }: CustomerPortalViewProps) {
  const isReadOnly = userRole === 'SystemAdmin';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Customer Portal</h2>
          <p className="text-muted-foreground">
            Configure self-service portal, announcements, and customer engagement
          </p>
        </div>
        <Button>
          <Globe className="h-4 w-4 mr-2" />
          Preview portal
        </Button>
      </div>

      {/* Portal Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground">Daily Active</p>
          <p className="text-foreground">7,200</p>
          <p className="text-sm text-green-600">+12% vs last week</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Survey Completion</p>
          <p className="text-foreground">62%</p>
          <p className="text-sm text-green-600">+5% MoM</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Self-Service Rate</p>
          <p className="text-foreground">78%</p>
          <p className="text-sm text-muted-foreground">Tickets created</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Avg Session</p>
          <p className="text-foreground">4m 32s</p>
          <p className="text-sm text-muted-foreground">-18s vs last week</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Mobile Users</p>
          <p className="text-foreground">68%</p>
          <p className="text-sm text-muted-foreground">4,896 of 7,200</p>
        </Card>
      </div>

      {/* Portal Actions Usage */}
      <Card className="p-6">
        <h3 className="mb-4">Top Portal Actions (Last 7 Days)</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={portalUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="action" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Portal Features */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4>View Billing</h4>
              <p className="text-sm text-muted-foreground">Invoice history & downloads</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usage this week</span>
              <span>2,840 views</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg time</span>
              <span>2m 15s</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Ticket className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4>Create Ticket</h4>
              <p className="text-sm text-muted-foreground">Service requests</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usage this week</span>
              <span>1,920 created</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion rate</span>
              <span>94%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4>Pay Invoice</h4>
              <p className="text-sm text-muted-foreground">Online payments</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usage this week</span>
              <span>1,420 payments</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success rate</span>
              <span>97.2%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Announcements & Maintenance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-muted-foreground" />
            <h3>Announcements & Maintenance</h3>
          </div>
          <Button variant="outline" size="sm">Create announcement</Button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600">Active</Badge>
                <span>Scheduled Maintenance</span>
              </div>
              <span className="text-sm text-muted-foreground">Published 2d ago</span>
            </div>
            <p className="text-sm text-blue-900 mb-2">
              Network upgrade in Makati area on Oct 22, 2:00 AM - 6:00 AM. Service may be briefly interrupted.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Unpublish</Button>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">Archived</Badge>
                <span>System Upgrade Complete</span>
              </div>
              <span className="text-sm text-muted-foreground">Published 5d ago</span>
            </div>
            <p className="text-sm text-green-900 mb-2">
              Portal upgrade completed successfully. New features now available: invoice history search and bulk payments.
            </p>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h4 className="mb-3">Create New Announcement</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Announcement title..." />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Announcement details..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button size="sm">Publish now</Button>
              <Button variant="outline" size="sm">Schedule</Button>
              <Button variant="outline" size="sm">Save draft</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Customer Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Customer Activity</h3>
          <Button variant="outline" size="sm">View all</Button>
        </div>

        <div className="space-y-2">
          {recentCustomerActions.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p>{activity.customer}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
