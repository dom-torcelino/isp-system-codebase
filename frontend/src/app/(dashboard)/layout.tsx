import { getUser } from "@/shared/lib/api";
import { LeftNav } from "@/widgets/LeftNav";
import { TopBar } from "@/widgets/TopBar";
import { PageContent } from "@/widgets/PageContent";
import { Toaster } from "@/shared/ui/sonner";
import { LogoutConfirmDialog } from "@/features/auth/components/LogoutConfirmDialog";
import { LocaleProvider } from "@/shared/contexts/LocaleContext";
import { NavigationProvider } from "@/shared/contexts/NavigationContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <LocaleProvider>
      <NavigationProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <LeftNav userRole={user.role} />

          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBar 
              userName={user.name} 
              currentRole={user.role} 
              currentTenant={user.tenant} 
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <PageContent>
                {children}
              </PageContent>
            </main>
          </div>

          <Toaster />
        </div>
      </NavigationProvider>
    </LocaleProvider>
  );
}