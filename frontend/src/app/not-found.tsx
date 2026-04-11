import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    // Why: Use a full-screen flex layout to ensure it looks deliberate and professional, even without the dashboard shell.
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-8">
        <FileQuestion className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        404 - Resource Not Found
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-10 text-lg">
        The requested module, tenant, or record does not exist. It may have been removed, or you may lack the necessary permissions to view it.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Why: Always provide a safe exit route back to a known-good state. */}
        <Button asChild variant="default" className="flex items-center gap-2">
          <Link href="/overview">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
        
        {/* Why: Allow users to step back if they clicked a broken internal link or mistyped a URL. */}
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}