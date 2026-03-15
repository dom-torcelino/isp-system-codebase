import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
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
import { Progress } from './ui/progress';
import { Plus, Building2, Lock, AlertTriangle } from 'lucide-react';
import { sampleTenants } from '../lib/sample-data';
import { Alert, AlertDescription } from './ui/alert';
import { UserRole } from '../types';
import { AddTenantWizard } from './AddTenantWizard';
import { TenantProvisioningScreen } from './TenantProvisioningScreen';
import { toast } from 'sonner';
import { useLocale } from '../contexts/LocaleContext';

const onboardingSteps = [
  { step: 'Account created', completed: 128, total: 128, percentage: 100 },
  { step: 'Branding configured', completed: 125, total: 128, percentage: 98 },
  { step: 'SLA profiles set', completed: 122, total: 128, percentage: 95 },
  { step: 'Payment method verified', completed: 118, total: 128, percentage: 92 },
  { step: 'Grace periods configured', completed: 115, total: 128, percentage: 90 },
];

interface TenantManagementViewProps {
  userRole: UserRole;
  onViewTenantDetails?: (tenantId: string) => void;
}

export function TenantManagementView({ userRole, onViewTenantDetails }: TenantManagementViewProps) {
  const { t } = useLocale();
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [showProvisioning, setShowProvisioning] = useState(false);
  const [newTenantId, setNewTenantId] = useState<string | null>(null);
  
  // Only SuperAdmin has access
  const hasAccess = userRole === 'SuperAdmin';
  
  const handleWizardSuccess = (tenantId: string) => {
    setNewTenantId(tenantId);
    setShowAddWizard(false);
    setShowProvisioning(true);
  };
  
  const handleProvisioningComplete = (tenantId: string) => {
    setShowProvisioning(false);
    toast.success(`Tenant ${tenantId} created. Admin invite sent.`);
    if (onViewTenantDetails) {
      onViewTenantDetails(tenantId);
    }
    setNewTenantId(null);
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
            Tenant Management requires Super Admin or System Admin privileges. Your current role does not include this permission.
          </p>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access denied by RBAC policy. Contact your system administrator.
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
          <h2>{t.tenants.title}</h2>
          <p className="text-muted-foreground">
            Onboard and configure ISP tenants with multi-tenant isolation
          </p>
        </div>
        <Button onClick={() => {
          if (userRole !== 'SuperAdmin') {
            toast.error('Restricted to Super Admin');
          } else {
            setShowAddWizard(true);
          }
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {t.tenants.addTenant}
        </Button>
      </div>

      {/* Tenant Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <p className="text-muted-foreground">Total Tenants</p>
          </div>
          <p className="text-foreground">128</p>
          <p className="text-sm text-green-600">+8% MoM</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Active</p>
          <p className="text-green-600">119</p>
          <p className="text-sm text-muted-foreground">93% of total</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Trial</p>
          <p className="text-amber-600">9</p>
          <p className="text-sm text-muted-foreground">3 ending this week</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Suspended</p>
          <p className="text-destructive">0</p>
          <p className="text-sm text-green-600">No issues</p>
        </Card>
      </div>

      {/* Onboarding Funnel */}
      <Card className="p-6">
        <h3 className="mb-4">Onboarding Completion Funnel</h3>
        <div className="space-y-4">
          {onboardingSteps.map((step, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{step.step}</span>
                <span className="text-sm text-muted-foreground">
                  {step.completed}/{step.total} tenants
                </span>
              </div>
              <Progress value={step.percentage} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-900 mb-1">13 tenants incomplete</p>
          <p className="text-amber-700 text-sm">
            Follow up with tenants to complete payment method verification and grace period configuration
          </p>
        </div>
      </Card>

      {/* Configuration Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="mb-1">Branding</h4>
            <p className="text-sm text-muted-foreground">Logo, colors, domain</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Configured</span>
              <span>125/128</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => toast.info('Branding configuration view coming soon')}
          >
            {t.common.viewAll}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h4 className="mb-1">SLA Profiles</h4>
            <p className="text-sm text-muted-foreground">Service level agreements</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Configured</span>
              <span>122/128</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => toast.info('SLA profiles view coming soon')}
          >
            {t.common.viewAll}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h4 className="mb-1">Payment Methods</h4>
            <p className="text-sm text-muted-foreground">Gateways & billing</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Verified</span>
              <span>118/128</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => toast.info('Payment methods view coming soon')}
          >
            {t.common.viewAll}
          </Button>
        </Card>
      </div>

      {/* Tenant List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>All Tenants</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.info('Filter functionality coming soon')}
            >
              {t.common.filter}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Exporting tenant data...')}
            >
              {t.common.export}
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant Name</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin Contact</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{tenant.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{tenant.plan}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tenant.status} />
                </TableCell>
                <TableCell>{tenant.admin}</TableCell>
                <TableCell>{tenant.created}</TableCell>
                <TableCell>₱{tenant.mrr.toLocaleString()}</TableCell>
                <TableCell>
                  {Math.floor(Math.random() * 3000) + 1000}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewTenantDetails?.(tenant.id)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewTenantDetails?.(tenant.id)}
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

      {/* Plan Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-muted-foreground mb-2">Starter Plan</p>
          <p className="text-blue-900">32 tenants</p>
          <p className="text-sm text-blue-700">₱1.44M MRR</p>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-muted-foreground mb-2">Pro Plan</p>
          <p className="text-purple-900">58 tenants</p>
          <p className="text-sm text-purple-700">₱4.93M MRR</p>
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-muted-foreground mb-2">Enterprise Plan</p>
          <p className="text-amber-900">38 tenants</p>
          <p className="text-sm text-amber-700">₱15.43M MRR</p>
        </Card>
      </div>
      
      {/* Add Tenant Wizard */}
      <AddTenantWizard
        open={showAddWizard}
        onOpenChange={setShowAddWizard}
        onSuccess={handleWizardSuccess}
        userRole={userRole}
      />
      
      {/* Provisioning Screen */}
      <TenantProvisioningScreen
        open={showProvisioning}
        onComplete={handleProvisioningComplete}
      />
    </div>
  );
}
