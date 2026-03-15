import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Building2,
  CreditCard,
  Users,
  Palette,
  Clock,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Check,
  Plus,
  Minus,
  Info,
  RotateCcw,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface AddTenantWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (tenantId: string) => void;
  userRole?: string;
}

type PlanType = 'Starter' | 'Pro' | 'Enterprise';
type PaymentMethod = 'Card' | 'GCash' | 'PayMaya' | 'Invoice';

const plans = [
  {
    name: 'Starter' as const,
    price: 2999,
    limits: '100 customers • 500 tickets/mo • 5 users',
    features: ['Basic ticketing', 'Email support', 'Standard SLA', 'Mobile app'],
  },
  {
    name: 'Pro' as const,
    price: 7999,
    limits: '500 customers • 2000 tickets/mo • 20 users',
    features: ['Advanced analytics', 'API access', 'Custom SLA', 'Priority support', 'Integrations'],
  },
  {
    name: 'Enterprise' as const,
    price: 19999,
    limits: 'Unlimited • Custom limits • Unlimited users',
    features: ['White-label', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Advanced security'],
  },
];

export function AddTenantWizard({ open, onOpenChange, onSuccess, userRole = 'SuperAdmin' }: AddTenantWizardProps) {
  const [step, setStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  
  // Step 1: Company Info
  const [companyName, setCompanyName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyErrors, setCompanyErrors] = useState({
    companyName: '',
    businessAddress: '',
    contactEmail: '',
    contactPhone: '',
  });
  
  // Step 2: Subscription Plan
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('Pro');
  const [seats, setSeats] = useState(5);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');
  
  // Step 3: Admin User
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [requireMfa, setRequireMfa] = useState(true);
  const [sendWelcome, setSendWelcome] = useState(true);
  const [adminErrors, setAdminErrors] = useState({
    adminName: '',
    adminEmail: '',
  });
  
  // Step 4: Branding
  const [brandColor, setBrandColor] = useState('#2A6AF0');
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  
  // Step 5: SLA & Grace Period
  const [slaHigh, setSlaHigh] = useState(4);
  const [slaMedium, setSlaMedium] = useState(8);
  const [slaLow, setSlaLow] = useState(24);
  const [graceDays, setGraceDays] = useState(7);
  
  // Step 6: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [showPaymentTest, setShowPaymentTest] = useState(false);
  const [paymentTesting, setPaymentTesting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Step 7: Review
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Discard confirmation
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  
  const totalSteps = 7;

  // Validation helpers
  const isEmailValid = (email: string) => /^.+@.+\..+$/.test(email);
  const isPhoneValid = (phone: string) => /^[\d\s+()-]+$/.test(phone) && phone.trim().length >= 10;

  // Validation guards
  const companyValid = () => {
    return companyName.trim().length > 1 && 
           businessAddress.trim().length > 1 && 
           isEmailValid(contactEmail) && 
           isPhoneValid(contactPhone);
  };

  const adminValid = () => {
    return adminName.trim().length > 1 && isEmailValid(adminEmail);
  };

  const validateStep1 = () => {
    const errors = {
      companyName: companyName.trim().length <= 1 ? 'Company name is required' : '',
      businessAddress: businessAddress.trim().length <= 1 ? 'Business address is required' : '',
      contactEmail: !isEmailValid(contactEmail) ? 'Valid email is required (e.g., contact@example.com)' : '',
      contactPhone: !isPhoneValid(contactPhone) ? 'Valid phone is required (e.g., +63 912 345 6789)' : '',
    };
    setCompanyErrors(errors);
    return !Object.values(errors).some(e => e !== '');
  };

  const validateStep3 = () => {
    const errors = {
      adminName: adminName.trim().length <= 1 ? 'Admin name is required' : '',
      adminEmail: !isEmailValid(adminEmail) ? 'Valid email is required' : '',
    };
    setAdminErrors(errors);
    return !Object.values(errors).some(e => e !== '');
  };

  const canGoNext = () => {
    switch (step) {
      case 1: return companyValid();
      case 2: return true;
      case 3: return adminValid();
      case 4: return true;
      case 5: return true;
      case 6: return paymentVerified || paymentMethod === 'Invoice';
      case 7: return termsAccepted && (paymentVerified || paymentMethod === 'Invoice');
      default: return false;
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !validateStep3()) return;
    
    if (canGoNext() && step < totalSteps) {
      setStep(step + 1);
      setIsDirty(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canNavigateToStep = (targetStep: number): { allowed: boolean; message?: string } => {
    // Can always go backward
    if (targetStep <= step) {
      return { allowed: true };
    }
    
    // Going forward requires validation
    if (targetStep > step) {
      // Check all steps between current and target
      for (let i = step; i < targetStep; i++) {
        if (i === 1 && !companyValid()) {
          return { allowed: false, message: 'Complete company information first' };
        }
        if (i === 3 && !adminValid()) {
          return { allowed: false, message: 'Complete admin user information first' };
        }
        if (i === 6 && !paymentVerified && paymentMethod !== 'Invoice') {
          return { allowed: false, message: 'Verify payment method first' };
        }
      }
      return { allowed: true };
    }
    
    return { allowed: false };
  };
  
  const handleStepClick = (targetStep: number) => {
    const navigation = canNavigateToStep(targetStep);
    
    if (!navigation.allowed && navigation.message) {
      toast.error(navigation.message);
      return;
    }
    
    if (navigation.allowed) {
      setStep(targetStep);
    }
  };

  const handleTestPayment = () => {
    setPaymentTesting(true);
    setPaymentError('');
    
    // Simulate payment verification (90% success rate)
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        setPaymentVerified(true);
        setPaymentTesting(false);
        setShowPaymentTest(false);
        toast.success('Gateway verified');
      } else {
        setPaymentTesting(false);
        setPaymentError('Connection failed. Please check your credentials and try again.');
      }
    }, 2000);
  };

  const handleCreate = () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms to continue');
      return;
    }
    
    // This will be handled by parent to show provisioning
    onSuccess('TEN-128');
    resetForm();
  };

  const handleSaveDraft = () => {
    const draft = {
      step,
      companyName,
      businessAddress,
      contactEmail,
      contactPhone,
      selectedPlan,
      seats,
      billingCycle,
      adminName,
      adminEmail,
      requireMfa,
      sendWelcome,
      brandColor,
      subdomain,
      slaHigh,
      slaMedium,
      slaLow,
      graceDays,
      paymentMethod,
      paymentVerified,
    };
    
    // Store in localStorage for demo purposes
    localStorage.setItem('tenantWizardDraft', JSON.stringify(draft));
    toast.success('Draft saved');
    setIsDirty(false);
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('tenantWizardDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setStep(draft.step || 1);
        setCompanyName(draft.companyName || '');
        setBusinessAddress(draft.businessAddress || '');
        setContactEmail(draft.contactEmail || '');
        setContactPhone(draft.contactPhone || '');
        setSelectedPlan(draft.selectedPlan || 'Pro');
        setSeats(draft.seats || 5);
        setBillingCycle(draft.billingCycle || 'Monthly');
        setAdminName(draft.adminName || '');
        setAdminEmail(draft.adminEmail || '');
        setRequireMfa(draft.requireMfa ?? true);
        setSendWelcome(draft.sendWelcome ?? true);
        setBrandColor(draft.brandColor || '#2A6AF0');
        setSubdomain(draft.subdomain || '');
        setSlaHigh(draft.slaHigh || 4);
        setSlaMedium(draft.slaMedium || 8);
        setSlaLow(draft.slaLow || 24);
        setGraceDays(draft.graceDays || 7);
        setPaymentMethod(draft.paymentMethod || 'Card');
        setPaymentVerified(draft.paymentVerified || false);
        setIsDirty(true);
        toast.info('Draft restored');
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsDirty(false);
    setCompanyName('');
    setBusinessAddress('');
    setContactEmail('');
    setContactPhone('');
    setCompanyErrors({ companyName: '', businessAddress: '', contactEmail: '', contactPhone: '' });
    setSelectedPlan('Pro');
    setSeats(5);
    setBillingCycle('Monthly');
    setAdminName('');
    setAdminEmail('');
    setAdminErrors({ adminName: '', adminEmail: '' });
    setRequireMfa(true);
    setSendWelcome(true);
    setBrandColor('#2A6AF0');
    setLogoUploaded(false);
    setSubdomain('');
    setSlaHigh(4);
    setSlaMedium(8);
    setSlaLow(24);
    setGraceDays(7);
    setPaymentMethod('Card');
    setPaymentVerified(false);
    setPaymentError('');
    setTermsAccepted(false);
    localStorage.removeItem('tenantWizardDraft');
  };

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      resetForm();
      onOpenChange(false);
    }
  };
  
  const handleConfirmDiscard = () => {
    setShowDiscardDialog(false);
    resetForm();
    onOpenChange(false);
  };

  // Load draft when opening wizard
  useEffect(() => {
    if (open) {
      const hasDraft = localStorage.getItem('tenantWizardDraft');
      if (hasDraft && !isDirty && step === 1) {
        // Auto-load draft without confirmation for better UX
        loadDraft();
      }
    }
  }, [open]);

  // Keyboard support
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      if (e.key === 'Enter' && !e.shiftKey && !isInput && canGoNext()) {
        e.preventDefault();
        if (step < totalSteps) {
          handleNext();
        } else {
          handleCreate();
        }
      }
      
      if (e.key === 'Escape' && !showDiscardDialog && !showPaymentTest) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, step, canGoNext, showDiscardDialog, showPaymentTest]);

  const calculateMRR = () => {
    const planPrice = plans.find(p => p.name === selectedPlan)?.price || 0;
    const seatPrice = selectedPlan === 'Starter' ? 299 : selectedPlan === 'Pro' ? 399 : 599;
    const baseSeats = selectedPlan === 'Starter' ? 5 : selectedPlan === 'Pro' ? 20 : 0;
    const extraSeats = Math.max(0, seats - baseSeats);
    const monthlyTotal = planPrice + (extraSeats * seatPrice);
    return billingCycle === 'Annual' ? monthlyTotal * 0.85 : monthlyTotal;
  };

  const steps = [
    { number: 1, title: 'Company Info', icon: Building2 },
    { number: 2, title: 'Subscription Plan', icon: CreditCard },
    { number: 3, title: 'Admin User', icon: Users },
    { number: 4, title: 'Branding', icon: Palette },
    { number: 5, title: 'SLA & Grace', icon: Clock },
    { number: 6, title: 'Payment Method', icon: Wallet },
    { number: 7, title: 'Review & Create', icon: CheckCircle2 },
  ];

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl h-[90vh] p-0">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Add Tenant</DialogTitle>
              <DialogDescription>
                Create a new ISP tenant with custom configuration
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <div className="flex h-full">
            {/* Left Stepper */}
            <div className="w-72 bg-muted/30 p-6 border-r">
              <h3 className="mb-6">Add Tenant</h3>
              <div className="space-y-4">
                {steps.map((s) => {
                  const Icon = s.icon;
                  const isCompleted = step > s.number;
                  const isCurrent = step === s.number;
                  
                  return (
                    <div
                      key={s.number}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                        isCurrent ? 'bg-primary/10' : isCompleted ? 'bg-success-50 dark:bg-success-900/20' : ''
                      } ${!isCurrent ? 'hover:bg-muted/50' : ''}`}
                      onClick={() => handleStepClick(s.number)}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-success-500 text-white'
                            : isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>{s.title}</p>
                        <p className="text-xs text-muted-foreground">Step {s.number} of {totalSteps}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6">
                <Progress value={(step / totalSteps) * 100} />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {Math.round((step / totalSteps) * 100)}% Complete • Step {step} of {totalSteps}
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                {/* Step 1: Company Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Company Information</h2>
                      <p className="text-muted-foreground">Basic details about the ISP tenant</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="company-name">
                          ISP Company Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="company-name"
                          placeholder="e.g., Speedy Fiber Networks"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            setIsDirty(true);
                            if (companyErrors.companyName) {
                              setCompanyErrors({ ...companyErrors, companyName: '' });
                            }
                          }}
                          onBlur={() => {
                            if (companyName.trim().length <= 1) {
                              setCompanyErrors({ ...companyErrors, companyName: 'Company name is required' });
                            }
                          }}
                          className={companyErrors.companyName ? 'border-destructive' : ''}
                        />
                        {companyErrors.companyName && (
                          <p className="text-xs text-destructive">{companyErrors.companyName}</p>
                        )}
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="business-address">
                          Business Address <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="business-address"
                          placeholder="Street, City, Province"
                          rows={3}
                          value={businessAddress}
                          onChange={(e) => {
                            setBusinessAddress(e.target.value);
                            setIsDirty(true);
                            if (companyErrors.businessAddress) {
                              setCompanyErrors({ ...companyErrors, businessAddress: '' });
                            }
                          }}
                          onBlur={() => {
                            if (businessAddress.trim().length <= 1) {
                              setCompanyErrors({ ...companyErrors, businessAddress: 'Business address is required' });
                            }
                          }}
                          className={companyErrors.businessAddress ? 'border-destructive' : ''}
                        />
                        {companyErrors.businessAddress && (
                          <p className="text-xs text-destructive">{companyErrors.businessAddress}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">
                          Contact Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="contact@example.com"
                          value={contactEmail}
                          onChange={(e) => {
                            setContactEmail(e.target.value);
                            setIsDirty(true);
                            if (companyErrors.contactEmail) {
                              setCompanyErrors({ ...companyErrors, contactEmail: '' });
                            }
                          }}
                          onBlur={() => {
                            if (!isEmailValid(contactEmail)) {
                              setCompanyErrors({ ...companyErrors, contactEmail: 'Valid email is required (e.g., contact@example.com)' });
                            }
                          }}
                          className={companyErrors.contactEmail ? 'border-destructive' : ''}
                        />
                        {companyErrors.contactEmail && (
                          <p className="text-xs text-destructive">{companyErrors.contactEmail}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">
                          Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-phone"
                          placeholder="+63 912 345 6789"
                          value={contactPhone}
                          onChange={(e) => {
                            setContactPhone(e.target.value);
                            setIsDirty(true);
                            if (companyErrors.contactPhone) {
                              setCompanyErrors({ ...companyErrors, contactPhone: '' });
                            }
                          }}
                          onBlur={() => {
                            if (!isPhoneValid(contactPhone)) {
                              setCompanyErrors({ ...companyErrors, contactPhone: 'Valid phone is required (e.g., +63 912 345 6789)' });
                            }
                          }}
                          className={companyErrors.contactPhone ? 'border-destructive' : ''}
                        />
                        {companyErrors.contactPhone && (
                          <p className="text-xs text-destructive">{companyErrors.contactPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Subscription Plan */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Subscription Plan</h2>
                      <p className="text-muted-foreground">Choose the right plan for this tenant</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <Card
                          key={plan.name}
                          className={`p-4 cursor-pointer transition-all ${
                            selectedPlan === plan.name
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedPlan(plan.name);
                            setIsDirty(true);
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4>{plan.name}</h4>
                            {selectedPlan === plan.name && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-2xl mb-2">₱{plan.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground mb-4">{plan.limits}</p>
                          <div className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="h-3 w-3 text-success-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Number of Seats</Label>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSeats(Math.max(1, seats - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={seats}
                            onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSeats(seats + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Billing Cycle</Label>
                        <Select value={billingCycle} onValueChange={(v: 'Monthly' | 'Annual') => setBillingCycle(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Annual">Annual (15% off)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated MRR</p>
                          <p className="text-2xl">₱{calculateMRR().toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">
                          {billingCycle === 'Annual' ? '15% discount applied' : 'Billed monthly'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        You can upgrade or downgrade anytime. Changes take effect immediately.
                      </p>
                    </Card>
                  </div>
                )}

                {/* Step 3: Admin User */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Admin User</h2>
                      <p className="text-muted-foreground">Create the primary administrator account</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="admin-name"
                          placeholder="John Doe"
                          value={adminName}
                          onChange={(e) => {
                            setAdminName(e.target.value);
                            setIsDirty(true);
                            if (adminErrors.adminName) {
                              setAdminErrors({ ...adminErrors, adminName: '' });
                            }
                          }}
                          onBlur={() => {
                            if (adminName.trim().length <= 1) {
                              setAdminErrors({ ...adminErrors, adminName: 'Admin name is required' });
                            }
                          }}
                          className={adminErrors.adminName ? 'border-destructive' : ''}
                        />
                        {adminErrors.adminName && (
                          <p className="text-xs text-destructive">{adminErrors.adminName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@example.com"
                          value={adminEmail}
                          onChange={(e) => {
                            setAdminEmail(e.target.value);
                            setIsDirty(true);
                            if (adminErrors.adminEmail) {
                              setAdminErrors({ ...adminErrors, adminEmail: '' });
                            }
                          }}
                          onBlur={() => {
                            if (!isEmailValid(adminEmail)) {
                              setAdminErrors({ ...adminErrors, adminEmail: 'Valid email is required' });
                            }
                          }}
                          className={adminErrors.adminEmail ? 'border-destructive' : ''}
                        />
                        {adminErrors.adminEmail && (
                          <p className="text-xs text-destructive">{adminErrors.adminEmail}</p>
                        )}
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <Label>Role</Label>
                        <Input value="System Admin" disabled />
                        <p className="text-xs text-muted-foreground">
                          This user will have full administrative access to the tenant
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="require-mfa">Require MFA at first login</Label>
                          <p className="text-sm text-muted-foreground">
                            User must set up multi-factor authentication
                          </p>
                        </div>
                        <Switch
                          id="require-mfa"
                          checked={requireMfa}
                          onCheckedChange={setRequireMfa}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-0.5">
                          <Label htmlFor="send-welcome">Send welcome email</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically send invitation with setup instructions
                          </p>
                        </div>
                        <Switch
                          id="send-welcome"
                          checked={sendWelcome}
                          onCheckedChange={setSendWelcome}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Branding */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Branding</h2>
                      <p className="text-muted-foreground">Customize the look and feel for this tenant</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Company Logo</Label>
                          <Card className="p-6 border-dashed cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center text-center">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                            </div>
                          </Card>
                          {logoUploaded && (
                            <div className="flex items-center gap-2 text-sm text-success-700">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>logo-company.png uploaded</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="brand-color">Brand Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="brand-color"
                              type="color"
                              value={brandColor}
                              onChange={(e) => setBrandColor(e.target.value)}
                              className="w-20 h-10"
                            />
                            <Input
                              value={brandColor}
                              onChange={(e) => setBrandColor(e.target.value)}
                              placeholder="#2A6AF0"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subdomain">Subdomain (Optional)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="subdomain"
                              placeholder="speedyfiber"
                              value={subdomain}
                              onChange={(e) => setSubdomain(e.target.value)}
                            />
                            <span className="text-sm text-muted-foreground">.portal.app</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Live Preview</Label>
                        <Card className="p-6">
                          <p className="text-sm text-muted-foreground mb-4">Button preview</p>
                          <Button style={{ backgroundColor: brandColor }} className="w-full mb-2">
                            Primary Button
                          </Button>
                          <Button variant="outline" style={{ borderColor: brandColor, color: brandColor }}>
                            Outline Button
                          </Button>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: SLA & Grace Period */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2>SLA & Grace Period</h2>
                      <p className="text-muted-foreground">Define service level agreements and billing grace</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sla-high">
                            High Priority <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="sla-high"
                              type="number"
                              value={slaHigh}
                              onChange={(e) => setSlaHigh(parseInt(e.target.value) || 0)}
                            />
                            <span className="text-sm text-muted-foreground">hrs</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sla-medium">
                            Medium Priority <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="sla-medium"
                              type="number"
                              value={slaMedium}
                              onChange={(e) => setSlaMedium(parseInt(e.target.value) || 0)}
                            />
                            <span className="text-sm text-muted-foreground">hrs</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sla-low">
                            Low Priority <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="sla-low"
                              type="number"
                              value={slaLow}
                              onChange={(e) => setSlaLow(parseInt(e.target.value) || 0)}
                            />
                            <span className="text-sm text-muted-foreground">hrs</span>
                          </div>
                        </div>
                      </div>
                      
                      <Card className="p-4 bg-info-50 dark:bg-info-900/20 border-info-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-info-700 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-info-700 mb-1">SLA targets determine response/resolution times</p>
                            <p className="text-info-600">
                              These will be used to calculate ticket ETAs and trigger escalations
                            </p>
                          </div>
                        </div>
                      </Card>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="grace-days">Grace Period for Overdue Billing</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="grace-days"
                            type="number"
                            value={graceDays}
                            onChange={(e) => setGraceDays(parseInt(e.target.value) || 0)}
                            className="w-32"
                          />
                          <span className="text-sm text-muted-foreground">days</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Allow this many days after invoice due date before suspending service
                        </p>
                      </div>
                      
                      <Button variant="link" className="p-0" onClick={() => {
                        setSlaHigh(4);
                        setSlaMedium(8);
                        setSlaLow(24);
                        setGraceDays(7);
                      }}>
                        <RotateCcw className="h-3 w-3 mr-2" />
                        Restore defaults
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Payment Method */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Payment Method</h2>
                      <p className="text-muted-foreground">Configure billing and payment processing</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {(['Card', 'GCash', 'PayMaya', 'Invoice'] as PaymentMethod[]).map((method) => (
                        <Card
                          key={method}
                          className={`p-4 cursor-pointer transition-all ${
                            paymentMethod === method
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setPaymentMethod(method);
                            if (method !== 'Invoice') {
                              setPaymentVerified(false);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Wallet className="h-5 w-5" />
                              <div>
                                <p>{method}</p>
                                <p className="text-xs text-muted-foreground">
                                  {method === 'Invoice' ? 'Manual billing' : 'Automated'}
                                </p>
                              </div>
                            </div>
                            {paymentMethod === method && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    {paymentMethod !== 'Invoice' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowPaymentTest(true)}
                            disabled={paymentVerified}
                          >
                            {paymentVerified ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-success-500" />
                                Gateway Verified
                              </>
                            ) : (
                              'Test Connection'
                            )}
                          </Button>
                          {paymentError && !paymentVerified && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPaymentError('');
                                setPaymentMethod(paymentMethod === 'Card' ? 'GCash' : 'Card');
                              }}
                            >
                              Switch Method
                            </Button>
                          )}
                        </div>
                        
                        {paymentError && (
                          <Card className="p-4 bg-error-50 dark:bg-error-900/20 border-error-200">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-error-700 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-error-700">{paymentError}</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-error-700"
                                  onClick={() => setShowPaymentTest(true)}
                                >
                                  Retry
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}
                        
                        {!paymentVerified && !paymentError && (
                          <Card className="p-4 bg-warning-50 dark:bg-warning-900/20 border-warning-200">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-warning-700 mt-0.5" />
                              <p className="text-sm text-warning-700">
                                Payment verification required before creating tenant
                              </p>
                            </div>
                          </Card>
                        )}
                      </div>
                    )}
                    
                    {paymentMethod === 'Invoice' && (
                      <Card className="p-4 bg-info-50 dark:bg-info-900/20 border-info-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-info-700 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-info-700 mb-1">Manual invoicing selected</p>
                            <p className="text-info-600">
                              You will need to generate and send invoices manually each billing cycle
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 7: Review & Create */}
                {step === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h2>Review & Create</h2>
                      <p className="text-muted-foreground">Confirm all details before creating tenant</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="mb-3">Company Information</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Company Name</p>
                            <p>{companyName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Contact Email</p>
                            <p>{contactEmail}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Business Address</p>
                            <p>{businessAddress}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-3">Subscription</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Plan</p>
                            <p>{selectedPlan}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Seats</p>
                            <p>{seats} users</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Billing Cycle</p>
                            <p>{billingCycle}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">MRR</p>
                            <p>₱{calculateMRR().toLocaleString()}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-3">Admin User</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p>{adminName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p>{adminEmail}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">MFA Required</p>
                            <p>{requireMfa ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Welcome Email</p>
                            <p>{sendWelcome ? 'Will be sent' : 'Disabled'}</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-3">Branding & Configuration</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Brand Color</p>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: brandColor }}
                              />
                              <span>{brandColor}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Subdomain</p>
                            <p>{subdomain || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">SLA Targets</p>
                            <p>High: {slaHigh}h • Med: {slaMedium}h • Low: {slaLow}h</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Grace Period</p>
                            <p>{graceDays} days</p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-3">Payment Method</h4>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <p className="text-muted-foreground">Method</p>
                            <p>{paymentMethod}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              paymentVerified || paymentMethod === 'Invoice'
                                ? 'bg-success-100 text-success-700 border-success-200'
                                : 'bg-warning-100 text-warning-700 border-warning-200'
                            }
                          >
                            {paymentVerified || paymentMethod === 'Invoice' ? 'Verified' : 'Not verified'}
                          </Badge>
                        </div>
                      </Card>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="cursor-pointer">
                          I confirm onboarding this tenant with the details above
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Footer Actions */}
              <div className="p-6 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                    Save draft
                  </Button>
                  {step < totalSteps ? (
                    <Button onClick={handleNext} disabled={!canGoNext()}>
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleCreate} disabled={!termsAccepted || !(paymentVerified || paymentMethod === 'Invoice')}>
                      Create Tenant
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Test Dialog */}
      <Dialog open={showPaymentTest} onOpenChange={setShowPaymentTest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Payment Gateway</DialogTitle>
            <DialogDescription>
              Verify connection to {paymentMethod} payment processor
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {paymentTesting ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Connecting to gateway...</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click test to verify {paymentMethod} integration is configured correctly.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentTest(false)} disabled={paymentTesting}>
              Cancel
            </Button>
            <Button onClick={handleTestPayment} disabled={paymentTesting}>
              Test Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close this wizard? All progress will be lost unless you save a draft first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue editing</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                setShowDiscardDialog(false);
                handleSaveDraft();
              }}
            >
              Save draft & close
            </Button>
            <AlertDialogAction onClick={handleConfirmDiscard} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
