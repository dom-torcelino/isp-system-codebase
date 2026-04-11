import { getUser } from "@/shared/lib/api";
import { TicketingViewV2 } from "@/features/tickets/components/TicketingViewV2";
import { RBACOverlay } from "@/shared/components/RBACOverlay";
import { hasAccess, getAccessDeniedReason } from "@/shared/lib/rbac";

export default async function TicketsPage() {
  const user = await getUser();

  if (!hasAccess(user.role, "tickets")) {
    return (
      <RBACOverlay
        reason={getAccessDeniedReason(user.role, "tickets")}
        userRole={user.role}
        moduleName="tickets"
      />
    );
  }

  return <TicketingViewV2 userRole={user.role} />;
}
