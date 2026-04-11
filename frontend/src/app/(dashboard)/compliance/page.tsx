import { getUser } from "@/shared/lib/api";
import { ComplianceView } from "@/features/compliance/components/ComplianceView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function CompliancePage() {
  const user = await getUser();

  if (!hasAccess(user.role, "compliance")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "compliance")}
        userRole={user.role}
        moduleName="compliance"
      />
    );
  }

  return <ComplianceView userRole={user.role} />;
}
