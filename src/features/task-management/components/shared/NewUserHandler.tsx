"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function NewUserHandler() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isNewUser = searchParams?.get("newUser") === "true";
    if (isNewUser) {
      queryClient.invalidateQueries();
    }
  }, [queryClient, searchParams]);

  return null;
}
