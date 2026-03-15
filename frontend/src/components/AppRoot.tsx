"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { LeftNav } from "@/components/LeftNav";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { TicketingViewV2 } from "@/components/TicketingViewV2";
import { BillingView } from "@/components/BillingView";
import { RevenueView } from "@/components/RevenueView";
import { CRMView } from "@/components/CRMView";
import { ComplianceView } from "@/components/ComplianceView";
import { TechnicianOperationsView } from "@/components/TechnicianOperationsView";
import { IntegrationsView } from "@/components/IntegrationsView";
import { ReportsView } from "@/components/ReportsView";
import { TenantManagementView } from "@/components/TenantManagementView";
import { TenantDetailsView } from "@/components/TenantDetailsView";
import { AuthSecurityView } from "@/components/AuthSecurityView";
import { SettingsView } from "@/components/SettingsView";
import { RBACOverlay } from "@/components/RBACOverlay";
import { LoginScreen } from "@/components/LoginScreen";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { UserRole, DateRange } from "../types";
import { hasAccess, getAccessDeniedReason, ModuleName } from "../lib/rbac";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { LocaleProvider } from "../contexts/LocaleContext";
type ViewType = ModuleName;
export default function AppRoot() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Jane D.");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // App state
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [currentTenant, setCurrentTenant] = useState("FiberFast ISP");
  const [currentRole, setCurrentRole] = useState<UserRole>("SystemAdmin");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null);
  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewType);
  };
  const handleRoleChange = (role: string) => {
    setCurrentRole(role as UserRole);
    // Reset to overview when role changes
    setCurrentView("overview");
  };
  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const handleLogin = (username: string, password: string) => {
    // Demo login - just check credentials
    if (username === "admin" && password === "Admin123") {
      setIsAuthenticated(true);
      setUserName("Jane D.");
      setCurrentRole("SuperAdmin");
      setCurrentView("overview");
      toast.success("Welcome back!");
    }
  };
  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };
  const handleLogoutConfirm = () => {
    // Reset state to defaults
    setIsAuthenticated(false);
    setUserName("Jane D.");
    setCurrentRole("SuperAdmin");
    setCurrentTenant("FiberFast ISP");
    setDateRange("30d");
    setCurrentView("overview");
    setNavCollapsed(false);
    setTheme("light");
    setShowLogoutDialog(false);
    toast.info("Signed out");
  };
  const renderContent = () => {
    // Check RBAC before rendering content
    if (!hasAccess(currentRole, currentView)) {
      return (
        <RBACOverlay
          reason={getAccessDeniedReason(currentRole, currentView)}
          userRole={currentRole}
          moduleName={currentView}
        />
      );
    }
    switch (currentView) {
      case "overview":
        return (
          <OverviewDashboard
            userRole={currentRole}
            onNavigate={handleNavigate}
          />
        );
      case "tickets":
        return <TicketingViewV2 userRole={currentRole} />;
      case "billing":
        return <BillingView userRole={currentRole} />;
      case "revenue":
        return <RevenueView userRole={currentRole} />;
      case "auth":
        return <AuthSecurityView userRole={currentRole} />;
      case "tenants":
        if (viewingTenantId) {
          return (
            <TenantDetailsView
              tenantId={viewingTenantId}
              onBack={() => setViewingTenantId(null)}
            />
          );
        }
        return (
          <TenantManagementView
            userRole={currentRole}
            onViewTenantDetails={(tenantId) => setViewingTenantId(tenantId)}
          />
        );
      case "technicians":
        return <TechnicianOperationsView userRole={currentRole} />;
      case "crm":
        return <CRMView userRole={currentRole} />;
      case "reports":
        return <ReportsView userRole={currentRole} />;
      case "compliance":
        return <ComplianceView userRole={currentRole} />;
      case "integrations":
        return <IntegrationsView userRole={currentRole} />;
      case "portal":
        return <CustomerPortalView userRole={currentRole} />;
      case "settings":
        return <SettingsView userRole={currentRole} />;
      default:
        return (
          <OverviewDashboard
            userRole={currentRole}
            onNavigate={handleNavigate}
          />
        );
    }
  };
  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LocaleProvider>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </LocaleProvider>
    );
  }
  return (
    <LocaleProvider>
      <div className="h-screen w-screen flex flex-row bg-background overflow-hidden">
        <LeftNav
          currentView={currentView}
          userRole={currentRole}
          onNavigate={handleNavigate}
          collapsed={navCollapsed}
          onCollapsedChange={setNavCollapsed}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            currentTenant={currentTenant}
            currentRole={currentRole}
            dateRange={dateRange}
            theme={theme}
            userName={userName}
            onTenantChange={setCurrentTenant}
            onDateRangeChange={(range) => setDateRange(range as DateRange)}
            onRoleChange={handleRoleChange}
            onThemeToggle={handleThemeToggle}
            onLogout={handleLogoutClick}
          />
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>

        <LogoutConfirmDialog
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
          onConfirm={handleLogoutConfirm}
        />

        <Toaster />
      </div>
    </LocaleProvider>
  );
}
// Placeholder views for other modules
interface ViewProps {
  userRole: UserRole;
}
function CustomerPortalView({ userRole }: ViewProps) {
  const isReadOnly = userRole === "SystemAdmin";

  return (
    <div className="space-y-6">
      <div>
        <h2>Customer Portal</h2>
        <p className="text-muted-foreground">
          Configure self-service portal and announcements
          {isReadOnly && " (Read-only access)"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Portal Visits (30d)", value: "12,456" },
          { label: "Self-Service Tickets", value: "892" },
          { label: "Payment Success Rate", value: "94.3%" },
        ].map((kpi, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-muted-foreground">{kpi.label}</p>
            <p className="text-foreground">{kpi.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
