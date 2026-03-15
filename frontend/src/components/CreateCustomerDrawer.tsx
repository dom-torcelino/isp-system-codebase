import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

interface CreateCustomerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customer: {
    name: string;
    email: string;
    plan: string;
    phone: string;
    city: string;
    notes: string;
    isVIP: boolean;
    churnRisk: string;
  }) => void;
}

export function CreateCustomerDrawer({
  open,
  onOpenChange,
  onSuccess,
}: CreateCustomerDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'Starter',
    phone: '',
    city: '',
    notes: '',
    isVIP: false,
    churnRisk: 'Low',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSuccess(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        plan: 'Starter',
        phone: '',
        city: '',
        notes: '',
        isVIP: false,
        churnRisk: 'Low',
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      plan: 'Starter',
      phone: '',
      city: '',
      notes: '',
      isVIP: false,
      churnRisk: 'Low',
    });
    setErrors({});
    onOpenChange(false);
  };

  const isValid = formData.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create Customer</SheetTitle>
          <SheetDescription>
            Add a new customer to your CRM system
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="customer@example.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select
              value={formData.plan}
              onValueChange={(value) => setFormData({ ...formData, plan: value })}
            >
              <SelectTrigger id="plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* VIP Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="vip">VIP Customer</Label>
              <p className="text-sm text-muted-foreground">
                Mark as high-value customer
              </p>
            </div>
            <Switch
              id="vip"
              checked={formData.isVIP}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isVIP: checked })
              }
            />
          </div>

          {/* Churn Risk */}
          <div className="space-y-2">
            <Label htmlFor="churnRisk">Churn Risk</Label>
            <Select
              value={formData.churnRisk}
              onValueChange={(value) => setFormData({ ...formData, churnRisk: value })}
            >
              <SelectTrigger id="churnRisk">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+63 XXX XXXX XXX"
            />
          </div>

          {/* City/Region */}
          <div className="space-y-2">
            <Label htmlFor="city">City/Region</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter city or region"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or comments..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Create Customer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
