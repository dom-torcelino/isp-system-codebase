import { getUser } from "@/shared/lib/api";
import { CustomerPortalView } from "@/features/crm/components/CustomerPortalView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function PortalPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "portal")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "portal")}
        userRole={user.role}
        moduleName="portal"
      />
    );
  }

  return <CustomerPortalView userRole={user.role} />;
}
