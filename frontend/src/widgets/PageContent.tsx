"use client";

import { ReactNode } from "react";
import { useNavigation } from "@/shared/contexts/NavigationContext";
import { PageSkeleton } from "@/shared/components/PageSkeleton"; 

export function PageContent({ children }: { children: ReactNode }) {
  const { isNavigating } = useNavigation();

  if (isNavigating) {
    return <PageSkeleton />;
  }

  return <>{children}</>;
}
