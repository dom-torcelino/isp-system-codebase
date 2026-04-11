import { getUser } from "@/shared/lib/api";
import { TechnicianOperationsView } from "@/features/technicians/components/TechnicianOperationsView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function TechniciansPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "technicians")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "technicians")}
        userRole={user.role}
        moduleName="technicians"
      />
    );
  }

  return <TechnicianOperationsView userRole={user.role} />;
}
