import { getUser } from "@/shared/lib/api";
import { SettingsView } from "@/features/settings/components/SettingsView";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function SettingsPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "settings")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "settings")}
        userRole={user.role}
        moduleName="settings"
      />
    );
  }

  return <SettingsView userRole={user.role} />;
}
