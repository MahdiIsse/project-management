"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/api/client";
import type { User } from "../types/user";


export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const userData = await apiClient.getCurrentUser();
      
      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        avatarUrl: userData.avatarUrl,
        createdAt: userData.createdAt,
        roles: userData.roles,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
