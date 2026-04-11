import { getUser } from "@/shared/lib/api";
import { BillingView } from "@/features/billing/components/BillingView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function BillingPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "billing")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "billing")}
        userRole={user.role}
        moduleName="billing"
      />
    );
  }

  return <BillingView userRole={user.role} />;
}
