import { getUser } from "@/shared/lib/api";
import { OverviewDashboard } from "@/features/overview/components/OverviewDashboard";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function OverviewPage() {
  // Why: Re-fetch user context. In Next.js App Router, fetch requests are automatically deduplicated, so this doesn't hit the Express backend twice.
  const user = await getUser();

  // Why: Server-side RBAC enforcement. Do not even render the HTML if they lack access.
  if (!hasAccess(user.role, "overview")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "overview")}
        userRole={user.role}
        moduleName="overview"
      />
    );
  }

  return <OverviewDashboard userRole={user.role} />;
}