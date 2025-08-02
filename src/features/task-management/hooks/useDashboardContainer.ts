"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function useDashboardContainer() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const isNewUser = searchParams?.get("newUser") === "true";
    if (isNewUser) {
      queryClient.invalidateQueries();
    }
  }, [queryClient, searchParams]);
} 