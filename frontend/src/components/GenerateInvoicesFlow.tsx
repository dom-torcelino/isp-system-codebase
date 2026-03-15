import { useState } from 'react';
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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface GenerateInvoicesFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (count: number) => void;
}

const GENERATION_STEPS = [
  'Collecting billable accounts',
  'Calculating charges',
  'Applying taxes/discounts',
  'Creating invoices',
  'Sending emails',
];

export function GenerateInvoicesFlow({
  open,
  onOpenChange,
  onSuccess,
}: GenerateInvoicesFlowProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    setHasError(false);
    onOpenChange(false);

    // Simulate generation process
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCurrentStep(i + 1);
    }

    // Randomly show error variant (20% chance)
    const shouldError = Math.random() < 0.2;
    if (shouldError) {
      setHasError(true);
      setErrorCount(5);
    } else {
      // Success
      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsGenerating(false);
      onSuccess(142);
    }
  };

  const handleRetry = async () => {
    setHasError(false);
    // Simulate retry
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGenerating(false);
    onSuccess(142);
  };

  const handleClose = () => {
    setIsGenerating(false);
    setCurrentStep(0);
    setHasError(false);
  };

  const progress = (currentStep / GENERATION_STEPS.length) * 100;

  return (
    <>
      {/* Confirmation Dialog */}
      <AlertDialog open={open && !isGenerating} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Invoices</AlertDialogTitle>
            <AlertDialogDescription>
              Generate monthly invoices for all active customers in the selected date
              range. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated count:</span>
              <span className="font-medium text-foreground">~142 invoices</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date range:</span>
              <span className="font-medium text-foreground">Oct 1-31, 2025</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tenant:</span>
              <span className="font-medium text-foreground">FiberFast ISP</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerate}>
              Generate Invoices
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Dialog */}
      <Dialog open={isGenerating} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" hideClose={!hasError}>
          {!hasError ? (
            <>
              <DialogTitle className="sr-only">Generating Invoices</DialogTitle>
              <DialogDescription className="sr-only">
                Please wait while we process your invoice generation request
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="sr-only">Email Sending Failed</DialogTitle>
              <DialogDescription className="sr-only">
                Email sending failed for some recipients
              </DialogDescription>
            </>
          )}
          <div className="space-y-6 py-4">
            {!hasError ? (
              <>
                {/* Progress indicator */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-foreground">Generating Invoices</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your request...
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Step {currentStep} of {GENERATION_STEPS.length}
                  </p>
                </div>

                {/* Steps list */}
                <div className="space-y-2">
                  {GENERATION_STEPS.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 text-sm p-2 rounded-md transition-colors ${
                        index < currentStep
                          ? 'text-green-600 bg-green-50 dark:bg-green-950/20'
                          : index === currentStep
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : index === currentStep ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      ) : (
                        <div className="h-4 w-4 shrink-0 rounded-full border-2 border-current" />
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Error state */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-foreground">Email Sending Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      Email sending failed for {errorCount} recipients
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    Invoices were created successfully, but some email notifications
                    could not be sent. You can retry sending emails now.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleClose}>
                    Close
                  </Button>
                  <Button className="flex-1" onClick={handleRetry}>
                    Retry Sending
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
