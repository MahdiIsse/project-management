"use client";

import { SidebarContainer } from "./SidebarContainer";
import { useCurrentUser } from "../../../auth/hooks/useUser";
import { apiClient } from "../../../../shared/lib/api/client";

export function AppSidebar() {
  const { data: user, isLoading, error } = useCurrentUser();

  const handleLogout = () => {
    apiClient.logout();
  };


  if (isLoading) {
    return (
      <div className="w-64 border-r bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 border-r bg-background flex items-center justify-center">
        <div className="text-sm text-red-500">Failed to load user</div>
      </div>
    );
  }

  return <SidebarContainer user={user || null} logout={handleLogout} />;
}
