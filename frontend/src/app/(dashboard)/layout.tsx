import { serverFetch } from "@/lib/api";
import { LeftNav } from "@/components/LeftNav";
import { TopBar } from "@/components/TopBar";
import { Toaster } from "@/components/ui/sonner";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import { LocaleProvider } from "@/contexts/LocaleContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Why: Fetch the authenticated user securely on the server. No loading spinners required.
  const user = await serverFetch("/api/v1/users/me");

  return (
    <LocaleProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Why: Pass the server-fetched user role to the navigation for RBAC link hiding */}
        <LeftNav userRole={user.role} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar 
            userName={user.name} 
            currentRole={user.role} 
            currentTenant={user.tenant} 
          />
          
          {/* Why: Next.js automatically injects the active page component (e.g., Overview, Billing) here based on the URL. */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

        {/* Note: In Next.js, interactive state like the Logout dialog should ideally be moved inside the TopBar component itself, as this layout is a Server Component. */}
        <Toaster />
      </div>
    </LocaleProvider>
  );
}