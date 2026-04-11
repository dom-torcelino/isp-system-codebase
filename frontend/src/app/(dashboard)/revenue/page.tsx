import { getUser } from "@/shared/lib/api";
import { RevenueView } from "@/features/revenue/components/RevenueView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function RevenuePage() {
  const user = await getUser();

  if (!hasAccess(user.role, "revenue")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "revenue")}
        userRole={user.role}
        moduleName="revenue"
      />
    );
  }

  return <RevenueView userRole={user.role} />;
}
