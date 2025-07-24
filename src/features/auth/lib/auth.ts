import { createServerClient } from "@/shared/lib/supabase/server";

export async function getAuthenticatedUser() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Je moet ingelogd zijn om deze actie uit te voeren");
  }
  
  return user;
}