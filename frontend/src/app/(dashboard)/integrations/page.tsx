import { getUser } from "@/shared/lib/api";
import { IntegrationsView } from "@/features/integrations/components/IntegrationsView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function IntegrationsPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "integrations")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "integrations")}
        userRole={user.role}
        moduleName="integrations"
      />
    );
  }

  return <IntegrationsView userRole={user.role} />;
}
