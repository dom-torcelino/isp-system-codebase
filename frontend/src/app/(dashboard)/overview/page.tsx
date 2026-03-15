import { serverFetch } from "@/lib/api";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { RBACOverlay } from "@/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/lib/rbac";

export default async function OverviewPage() {
  // Why: Re-fetch user context. In Next.js App Router, fetch requests are automatically deduplicated, so this doesn't hit the Express backend twice.
  const user = await serverFetch("/api/v1/users/me");

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