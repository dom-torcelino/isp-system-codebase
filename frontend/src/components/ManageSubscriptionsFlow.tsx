import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Search, TrendingUp, Users, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sampleTenants } from '../lib/sample-data';

interface ManageSubscriptionsFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 45000,
    features: ['Up to 5,000 customers', 'Basic support', 'Core features'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 85000,
    features: ['Up to 20,000 customers', 'Priority support', 'Advanced features', 'API access'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 155000,
    features: ['Unlimited customers', '24/7 support', 'All features', 'Custom integrations'],
  },
];

export function ManageSubscriptionsFlow({
  open,
  onOpenChange,
  onSuccess,
}: ManageSubscriptionsFlowProps) {
  const [selectedTenant, setSelectedTenant] = useState(sampleTenants[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [adjustSeatsOpen, setAdjustSeatsOpen] = useState(false);
  const [cancelSubOpen, setCancelSubOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [seats, setSeats] = useState(10);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');

  const filteredTenants = sampleTenants.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePlan = () => {
    setChangePlanOpen(false);
    onSuccess();
  };

  const handleAdjustSeats = () => {
    setAdjustSeatsOpen(false);
    onSuccess();
  };

  const handleCancelSub = () => {
    setCancelSubOpen(false);
    onSuccess();
  };

  const selectedPlanData = PLANS.find((p) => p.id === selectedPlan);
  const seatPrice = selectedPlanData ? selectedPlanData.price / 10 : 0;
  const totalPrice = selectedPlanData ? selectedPlanData.price + (seats - 10) * seatPrice : 0;

  return (
    <>
      {/* Main Subscriptions Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogTitle className="sr-only">Manage Tenant Subscriptions</DialogTitle>
          <DialogDescription className="sr-only">
            View and manage subscription plans and billing for all tenants
          </DialogDescription>
          <div className="flex h-full">
            {/* Left column: Tenants list */}
            <div className="w-80 border-r border-border flex flex-col">
              <div className="p-6 border-b border-border">
                <h3 className="text-foreground mb-1">Tenant Subscriptions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage plans and billing
                </p>
              </div>

              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {filteredTenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                      selectedTenant.id === tenant.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-foreground">{tenant.name}</p>
                      <Badge
                        variant={tenant.status === 'Trial' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {tenant.plan}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>₱{(tenant.mrr / 1000).toFixed(0)}k MRR</span>
                      {tenant.status === 'Trial' && (
                        <Badge variant="outline" className="text-xs">Trial</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right panel: Selected tenant details */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-foreground">{selectedTenant.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        Tenant ID: {selectedTenant.id}
                      </p>
                    </div>
                    <Badge
                      variant={selectedTenant.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {selectedTenant.status}
                    </Badge>
                  </div>

                  {/* Current Plan Card */}
                  <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">
                          {selectedTenant.plan} Plan
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        ₱{selectedTenant.mrr.toLocaleString()}/month
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-medium text-foreground">10 users</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Billing cycle</p>
                        <p className="font-medium text-foreground">Monthly</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next renewal</p>
                        <p className="font-medium text-foreground">Nov 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Auto-renew</p>
                        <p className="font-medium text-foreground">Enabled</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="mb-6">
                  <h4 className="text-foreground mb-3">Usage Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                      <p className="text-foreground">8 / 10</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">API Calls (MTD)</p>
                      </div>
                      <p className="text-foreground">2.3M / 5M</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Health Score</p>
                      </div>
                      <p className="text-green-600">92/100</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <h4 className="text-foreground">Subscription Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setChangePlanOpen(true)}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Change Plan
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setAdjustSeatsOpen(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Adjust Seats
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setCancelSubOpen(true)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <AlertDialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new plan for {selectedTenant.name}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
            {PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={plan.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{plan.name}</p>
                    <p className="font-medium text-foreground">
                      ₱{plan.price.toLocaleString()}/mo
                    </p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </label>
            ))}
          </RadioGroup>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Current plan:</span>
              <span className="font-medium text-foreground">{selectedTenant.plan}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">New plan:</span>
              <span className="font-medium text-foreground">{selectedPlanData?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Proration:</span>
              <span className="font-medium text-foreground">₱12,400 credit</span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangePlan}>
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Adjust Seats Dialog */}
      <AlertDialog open={adjustSeatsOpen} onOpenChange={setAdjustSeatsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adjust Seats</AlertDialogTitle>
            <AlertDialogDescription>
              Change the number of user seats for {selectedTenant.name}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="seats">Number of Seats</Label>
              <div className="flex items-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                >
                  -
                </Button>
                <Input
                  id="seats"
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(seats + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base price:</span>
                <span className="font-medium text-foreground">
                  ₱{selectedPlanData?.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Additional seats ({seats - 10}):</span>
                <span className="font-medium text-foreground">
                  ₱{((seats - 10) * seatPrice).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="font-medium text-foreground">New monthly total:</span>
                <span className="font-medium text-foreground">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdjustSeats}>
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={cancelSubOpen} onOpenChange={setCancelSubOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the subscription for {selectedTenant.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Cancellation Reason</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger id="reason" className="mt-2">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="too-expensive">Too expensive</SelectItem>
                  <SelectItem value="missing-features">Missing features</SelectItem>
                  <SelectItem value="switching-provider">Switching to another provider</SelectItem>
                  <SelectItem value="business-closed">Business closed</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="note">Additional Notes (Optional)</Label>
              <Textarea
                id="note"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Please provide additional details..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">
                <strong>Warning:</strong> Canceling this subscription will immediately suspend
                access and cannot be undone. The tenant will lose access to all features.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSub}
              className="bg-destructive hover:bg-destructive/90"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
