import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { integrationStatus } from '../lib/sample-data';
import { UserRole } from '../types';
import { Plus, Radio, Sheet, Wallet, CreditCard, Zap, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface IntegrationsViewProps {
  userRole: UserRole;
}

const apiUsageData = [
  { hour: '00:00', calls: 320, errors: 8 },
  { hour: '04:00', calls: 180, errors: 4 },
  { hour: '08:00', calls: 890, errors: 12 },
  { hour: '12:00', calls: 1240, errors: 45 },
  { hour: '16:00', calls: 1520, errors: 38 },
  { hour: '20:00', calls: 980, errors: 22 },
];

const integrationIcons: { [key: string]: any } = {
  Radio: Radio,
  Sheet: Sheet,
  Wallet: Wallet,
  CreditCard: CreditCard,
};

export function IntegrationsView({ userRole }: IntegrationsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Integration & Scalability</h2>
          <p className="text-muted-foreground">
            Manage third-party integrations and monitor API performance
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add integration
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-muted-foreground mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <p className="text-green-800">All Systems Operational</p>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground mb-1">API Calls Today</p>
          <p className="text-foreground">12,400</p>
          <p className="text-sm text-muted-foreground">Avg: 517/hour</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground mb-1">Error Rate</p>
          <p className="text-foreground">3.2%</p>
          <p className="text-sm text-amber-600">129 errors today</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground mb-1">Active Integrations</p>
          <p className="text-foreground">5</p>
          <p className="text-sm text-green-600">1 requires attention</p>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-3 gap-4">
        {integrationStatus.map((integration) => {
          const IconComponent = integrationIcons[integration.icon] || Zap;
          const isWarning = integration.health === 'Warning';

          return (
            <Card
              key={integration.name}
              className={`p-6 ${
                isWarning ? 'border-amber-300 bg-amber-50' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-200' : 'bg-blue-100'}`}>
                    <IconComponent className={`h-5 w-5 ${isWarning ? 'text-amber-700' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h4>{integration.name}</h4>
                    <p className="text-sm text-muted-foreground">{integration.status}</p>
                  </div>
                </div>
                <div className={`h-2 w-2 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-green-500'}`} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={isWarning ? 'secondary' : 'default'}
                    className={isWarning ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}
                  >
                    {integration.health}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last sync</span>
                  <span>{Math.floor(Math.random() * 30) + 1} min ago</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Logs
                </Button>
              </div>

              {isWarning && (
                <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-700 mt-0.5" />
                    <p className="text-sm text-amber-800">API key expires in 7 days</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {/* Add New Integration Card */}
        <Card className="p-6 border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="mb-1">Add Integration</h4>
            <p className="text-sm text-muted-foreground">
              Connect new services and APIs
            </p>
          </div>
        </Card>
      </div>

      {/* API Usage Chart */}
      <Card className="p-6">
        <h3 className="mb-4">API Usage (Last 24 Hours)</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="API Calls"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* API Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>API Management</h3>
          <Button variant="outline">View documentation</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">REST API</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Public REST API for tenant integrations
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Manage keys</Button>
              <Button variant="outline" size="sm">Rate limits</Button>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h4 className="mb-2">Webhooks</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Real-time event notifications to external systems
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Configure</Button>
              <Button variant="outline" size="sm">Test</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
