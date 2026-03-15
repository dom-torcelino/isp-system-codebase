import { Lock, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { UserRole } from '../types';

interface RBACOverlayProps {
  reason: string;
  userRole: UserRole;
  moduleName?: string;
}

export function RBACOverlay({ reason, userRole, moduleName }: RBACOverlayProps) {
  return (
    <div className="relative min-h-[400px] flex items-center justify-center">
      {/* Blurred background hint */}
      <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm rounded-lg" />
      
      {/* Overlay content */}
      <div className="relative z-10 text-center max-w-md px-6 py-8 bg-card border-2 border-border rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        
        <h3 className="mb-2">Access Denied</h3>
        <p className="text-muted-foreground mb-1">{reason}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Your current role: <span className="font-medium text-foreground">{userRole}</span>
        </p>
        
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Request Access
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Contact your administrator to request access to this module
          </p>
        </div>
      </div>
    </div>
  );
}
