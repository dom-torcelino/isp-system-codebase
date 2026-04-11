import { getUser } from "@/shared/lib/api";
import { ReportsView } from "@/features/reports/components/ReportsView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function ReportsPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "reports")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "reports")}
        userRole={user.role}
        moduleName="reports"
      />
    );
  }

  return <ReportsView userRole={user.role} />;
}
