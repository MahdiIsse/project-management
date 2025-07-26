import { createServerClient } from "@/shared/lib/supabase/server";
import { SidebarContainer } from "./SidebarContainer";
import { logout } from "@/features/auth";

export async function AppSidebar() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SidebarContainer user={user} logout={logout} />;
}
