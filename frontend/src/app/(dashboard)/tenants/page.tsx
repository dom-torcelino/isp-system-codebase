import { getUser } from "@/shared/lib/api";
import { TenantManagementView } from "@/features/tenants/components/TenantManagementView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function TenantsPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "tenants")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "tenants")}
        userRole={user.role}
        moduleName="tenants"
      />
    );
  }

  return <TenantManagementView userRole={user.role} />;
}
