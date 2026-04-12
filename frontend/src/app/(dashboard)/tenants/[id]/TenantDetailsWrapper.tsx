"use client";

import { useRouter } from "next/navigation";
import { TenantDetailsView } from "@/features/tenants/components/TenantDetailsView";

export function TenantDetailsWrapper({ tenantId }: { tenantId: string }) {
  const router = useRouter();

  return (
    <TenantDetailsView
      tenantId={tenantId}
      onBack={() => router.push("/tenants")}
    />
  );
}
