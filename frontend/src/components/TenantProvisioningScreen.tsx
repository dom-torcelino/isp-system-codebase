import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';

interface TenantProvisioningScreenProps {
  open: boolean;
  onComplete: (tenantId: string) => void;
}

const provisioningSteps = [
  { id: 1, label: 'Create isolated schema', duration: 800 },
  { id: 2, label: 'Seed default roles & permissions', duration: 600 },
  { id: 3, label: 'Apply branding', duration: 500 },
  { id: 4, label: 'Configure SLA & grace rules', duration: 700 },
  { id: 5, label: 'Verify payment method', duration: 900 },
  { id: 6, label: 'Send admin invite email', duration: 500 },
];

export function TenantProvisioningScreen({ open, onComplete }: TenantProvisioningScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let totalDuration = provisioningSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const runStep = () => {
      if (stepIndex >= provisioningSteps.length) {
        setTimeout(() => {
          onComplete('TEN-128');
        }, 500);
        return;
      }

      const step = provisioningSteps[stepIndex];
      setCurrentStep(stepIndex + 1);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const now = Date.now();
        const stepElapsed = now - startTime;
        const stepProgress = Math.min(stepElapsed / step.duration, 1);
        
        elapsed = provisioningSteps
          .slice(0, stepIndex)
          .reduce((sum, s) => sum + s.duration, 0) + (stepProgress * step.duration);
        
        setProgress((elapsed / totalDuration) * 100);

        if (stepProgress >= 1) {
          clearInterval(interval);
          stepIndex++;
          setTimeout(runStep, 100);
        }
      }, 50);
    };

    runStep();
  }, [open, onComplete]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">Provisioning Tenant</DialogTitle>
          <DialogDescription className="text-center">
            Setting up your new tenant environment...
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">

          <div className="space-y-4 mb-6">
            {provisioningSteps.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10' : isCompleted ? 'bg-success-50 dark:bg-success-900/20' : 'bg-muted/30'
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-success-500 text-white'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs">{step.id}</span>
                    )}
                  </div>
                  <p className="text-sm flex-1">{step.label}</p>
                </div>
              );
            })}
          </div>

          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
