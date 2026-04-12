import { getUser } from "@/shared/lib/api";
import { TenantDetailsView } from "@/features/tenants/components/TenantDetailsView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";
import { TenantDetailsWrapper } from "./TenantDetailsWrapper";

export default async function TenantDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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

  return <TenantDetailsWrapper tenantId={params.id} />;
}
