"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { LeftNav } from "@/components/LeftNav";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { Toaster } from "@/components/ui/sonner";
import { logoutAction } from "@/actions/auth";
import { hasAccess, getAccessDeniedReason, ModuleName } from "../lib/rbac";
import { RBACOverlay } from "@/components/RBACOverlay";
import { UserRole } from "@/types";

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
    const router = useRouter();
    
    // Why: The URL dictates the active view. Fallback to 'overview' if at the root.
    const currentView = (pathname.split("/")[1] || "overview") as ModuleName;

    const [navCollapsed, setNavCollapsed] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [dateRange, setDateRange] = useState("30d");

    const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
    const [currentTenant, setCurrentTenant] = useState<string>(user.tenant);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    // Why: Intercept the LeftNav click and force a real Next.js URL transition.
    const handleNavigate = (view: string) => {
        router.push(`/${view}`);
    };

    // Why: Compute RBAC on every render based on the current URL and selected Role.
    const userHasAccess = hasAccess(currentRole, currentView);

    return (
        <div className="h-screen w-screen flex flex-row bg-background overflow-hidden">
            <LeftNav
                currentView={currentView}
                userRole={currentRole} 
                onNavigate={handleNavigate} // LeftNav must trigger the router.push above
                collapsed={navCollapsed}
                onCollapsedChange={setNavCollapsed}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar
                    currentTenant={currentTenant}
                    currentRole={currentRole}
                    dateRange={dateRange}
                    theme={theme}
                    userName={user.name}
                    onTenantChange={setCurrentTenant}
                    onRoleChange={(role) => setCurrentRole(role as UserRole)}
                    onDateRangeChange={setDateRange}
                    onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
                    onLogout={() => setShowLogoutDialog(true)}
                />

                <main className="flex-1 overflow-y-auto p-6 relative">
                    {/* Why: UI-Level RBAC Enforcement. If access is denied, block the children and render the overlay. */}
                    {!userHasAccess ? (
                        <RBACOverlay
                            reason={getAccessDeniedReason(currentRole, currentView)}
                            userRole={currentRole}
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