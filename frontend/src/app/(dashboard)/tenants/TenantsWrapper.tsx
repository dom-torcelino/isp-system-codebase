"use client";

import { useRouter } from "next/navigation";
import { TenantManagementView } from "@/features/tenants/components/TenantManagementView";
import { UserRole } from "@/shared/types";

export function TenantsWrapper({ userRole }: { userRole: UserRole }) {
  const router = useRouter();

  return (
    <TenantManagementView
      userRole={userRole}
      onViewTenantDetails={(tenantId) => router.push(`/tenants/${tenantId}`)}
    />
  );
}
