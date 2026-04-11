import { getUser } from "@/shared/lib/api";
import { CRMView } from "@/features/crm/components/CRMView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function CRMPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "crm")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "crm")}
        userRole={user.role}
        moduleName="crm"
      />
    );
  }

  return <CRMView userRole={user.role} />;
}
