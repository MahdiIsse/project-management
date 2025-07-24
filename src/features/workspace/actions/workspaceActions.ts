"use server"

import { createServerClient } from "@/shared/lib/supabase/server";
import type { Workspace } from "@/features/workspace";
import { getAuthenticatedUser } from "@/features/auth";
import { mapWorkspace } from "@/features/workspace";

export async function getWorkspaces(): Promise<Workspace[]> {
  const supabase = await createServerClient()

  const {data, error} = await supabase.from("workspaces").select("*").order("position", {ascending: true})

  if (error) throw error
  return (data || []).map(mapWorkspace)
}


export async function createWorkspace(data: Workspace) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data: maxData} = await supabase
    .from("workspaces")
    .select("position")
    .eq("owner_id", user.id)
    .order("position", {ascending: false})
    .limit(1)
    .single()

  const newPosition = maxData && maxData.position !== null && maxData.position !== undefined ? maxData.position + 1 : 0

  const {error} = await supabase
    .from("workspaces")
    .insert({...data, owner_id: user.id, position: newPosition})

  if (error) throw error
}

export async function updateWorkspace(id: string, data: Partial<Workspace>) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {error} = await supabase.from("workspaces").update({...data}).eq("id", id).eq("owner_id", user.id)

  if (error) throw error
}

export async function deleteWorkspace(id: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("workspaces").delete().eq("id", id).eq("owner_id", user.id)

  if (error) throw error
}

export async function updateWorkspacesPositions(updates: {id: string, position: number}[]) {
  
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  for (const {id, position} of updates) {
    const {error} = await supabase
      .from("workspaces")
      .update({position})
      .eq("id", id)
      .eq("owner_id", user.id)

    if (error) throw error
  }
}