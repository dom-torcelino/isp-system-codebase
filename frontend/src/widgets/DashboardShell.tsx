// @ts-nocheck — Legacy widget, not used by App Router
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/widgets/TopBar";
import { LeftNav } from "@/widgets/LeftNav";
import { LogoutConfirmDialog } from "@/features/auth/components/LogoutConfirmDialog";
import { Toaster } from "@/shared/ui/sonner";
import { logoutAction } from "@/actions/auth";
import { hasAccess, getAccessDeniedReason, ModuleName } from "@/shared/lib/rbac";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { UserRole } from "@/shared/types";

interface DashboardShellProps {
    children: React.ReactNode;
    user: {
        name: string;
        role: UserRole;
        tenant: string;
    };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
    const pathname = usePathname();
    
    // Why: The URL dictates the active view. Fallback to 'overview' if at the root.
    const currentView = (pathname.split("/")[1] || "overview") as ModuleName;

    const [navCollapsed, setNavCollapsed] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Why: Compute RBAC on every render based on the current URL and user role.
    const userHasAccess = hasAccess(user.role, currentView);

    return (
        <div className="h-screen w-screen flex flex-row bg-background overflow-hidden">
            <LeftNav
                userRole={user.role}
                collapsed={navCollapsed}
                onCollapsedChange={setNavCollapsed}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar
                    currentTenant={user.tenant}
                    currentRole={user.role}
                    userName={user.name}
                />

                <main className="flex-1 overflow-y-auto p-6 relative">
                    {/* Why: UI-Level RBAC Enforcement. If access is denied, block the children and render the overlay. */}
                    {!userHasAccess ? (
                        <RBACOverlay
                            reason={getAccessDeniedReason(user.role, currentView)}
                            userRole={user.role}
                            moduleName={currentView}
                        />
                    ) : (
                        children
                    )}
                </main>
            </div>

            <LogoutConfirmDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                onConfirm={() => logoutAction()}
            />
            <Toaster />
        </div>
    );
}