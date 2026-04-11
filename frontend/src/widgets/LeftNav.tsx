"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Shield, Building2, Ticket, Wrench, Users,
  CreditCard, TrendingUp, BarChart3, FileCheck, Plug, Globe,
  Settings, Lock, ChevronLeft, ChevronRight,
} from "lucide-react";

import { cn } from "@/shared/ui/utils";
import { UserRole } from "@/shared/types";
import { hasAccess, getAccessDeniedReason, ModuleName } from "@/shared/lib/rbac";
import { useNavigation } from "@/shared/contexts/NavigationContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/shared/contexts/LocaleContext";

interface NavItem {
  id: ModuleName;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Why: Static array hoisted outside the component to avoid recreation on every render.
const NAV_ITEMS: NavItem[] = [
  { id: "overview", href: "/overview", icon: LayoutDashboard },
  { id: "auth", href: "/auth", icon: Shield },
  { id: "tenants", href: "/tenants", icon: Building2 },
  { id: "tickets", href: "/tickets", icon: Ticket },
  { id: "technicians", href: "/technicians", icon: Wrench },
  { id: "crm", href: "/crm", icon: Users },
  { id: "billing", href: "/billing", icon: CreditCard },
  { id: "revenue", href: "/revenue", icon: TrendingUp },
  { id: "reports", href: "/reports", icon: BarChart3 },
  { id: "compliance", href: "/compliance", icon: FileCheck },
  { id: "integrations", href: "/integrations", icon: Plug },
  { id: "portal", href: "/portal", icon: Globe },
  { id: "settings", href: "/settings", icon: Settings },
];

// Why: Fixed widths as constants for the sidebar.
const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

// Why: Removed 'currentView' and 'onNavigate'. The URL is now the single source of truth for navigation state.
interface LeftNavProps {
  userRole: UserRole;
  tenantName?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function LeftNav({
  userRole,
  tenantName = "FiberFast ISP",
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: LeftNavProps) {
  const { t } = useLocale();
  
  // Why: Hook into Next.js router to determine the active page based on the actual URL.
  const pathname = usePathname();
  const { startNavigation } = useNavigation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);

  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = onCollapsedChange || setInternalCollapsed;

  // Why: Gracefully handle responsive design without blocking the main thread.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280 && !collapsed) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, setCollapsed]);

  return (
    // Why: Fixed width at SIDEBAR_EXPANDED. The collapse animation uses GPU-accelerated translateX
    // to slide the overflow off-screen instead of animating width (which triggers expensive layout reflow).
    <div
      className="h-full bg-sidebar border-r border-sidebar-border flex flex-col will-change-transform"
      style={{
        width: SIDEBAR_EXPANDED,
        transform: collapsed ? `translateX(-${SIDEBAR_EXPANDED - SIDEBAR_COLLAPSED}px)` : 'translateX(0)',
        marginRight: collapsed ? -(SIDEBAR_EXPANDED - SIDEBAR_COLLAPSED) : 0,
        transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), margin-right 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="border-t border-sidebar-border">
        <div className={cn("flex items-center justify-center p-2", collapsed && "border-t border-sidebar-border")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{tenantName}</span>
                <ChevronLeft className="h-4 w-4 mr-2" />
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <TooltipProvider>
          <nav className={cn("space-y-1", collapsed ? "px-2" : "px-3")}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              
              // Why: Use optimistic path for instant feedback, fall back to actual pathname once navigation completes.
              const activePath = optimisticPath ?? pathname;
              const isActive = activePath.startsWith(item.href);
              const canAccess = hasAccess(userRole, item.id);
              const deniedReason = canAccess ? "" : getAccessDeniedReason(userRole, item.id);

              const navItemContent = (
                <div
                  className={cn(
                    "w-full flex items-center rounded-lg transition-colors duration-150 relative",
                    collapsed ? "gap-0 px-3 py-2.5 justify-center" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                    !canAccess && "opacity-50 cursor-not-allowed",
                    isActive && collapsed && "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:rounded-r-full before:bg-primary"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  {!collapsed && (
                    <>
                      {/* Why: Safe object key casting for locale translation mapping */}
                      <span className="truncate">{t.nav[item.id as keyof typeof t.nav] || item.id}</span>
                      {!canAccess && <Lock className="h-3 w-3 ml-auto shrink-0" />}
                    </>
                  )}
                </div>
              );

              // Why: If user lacks access, render a dead div instead of a Link to prevent unauthorized client-side routing attempts.
              const InteractiveWrapper = canAccess ? (
                <Link href={item.href} className="block w-full" onClick={() => { setOptimisticPath(item.href); startNavigation(item.href); }}>
                  {navItemContent}
                </Link>
              ) : (
                <button disabled className="block w-full text-left">
                  {navItemContent}
                </button>
              );

              if (collapsed || !canAccess) {
                return (
                  <Tooltip key={item.id} delayDuration={collapsed ? 200 : 0}>
                    <TooltipTrigger asChild>
                      {/* Why: TooltipTrigger requires a single valid React child node. */}
                      <div>{InteractiveWrapper}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px]">
                      {collapsed ? (
                        <p className="text-sm">{t.nav[item.id as keyof typeof t.nav] || item.id}</p>
                      ) : (
                        <p className="text-sm">{deniedReason}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.id}>{InteractiveWrapper}</div>;
            })}
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
}