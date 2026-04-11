import { getUser } from "@/shared/lib/api";
import { AuthSecurityView } from "@/features/auth/components/AuthSecurityView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function AuthPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "auth")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "auth")}
        userRole={user.role}
        moduleName="auth"
      />
    );
  }

  return <AuthSecurityView userRole={user.role} />;
}
