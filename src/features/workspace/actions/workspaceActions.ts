"use server"

import { createServerClient } from "@/shared/lib/supabase/server";
import type { Workspace, WorkspaceSchemaValues } from "@/features/workspace";
import { getAuthenticatedUser } from "@/features/auth";
import { mapWorkspace } from "@/features/workspace";
import { COLUMN_COLORS } from "@/features/task-management/utils";

export async function getWorkspaces(): Promise<Workspace[]> {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data, error} = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .order("position", {ascending: true})

  if (error) throw error
  return (data || []).map(mapWorkspace)
}


export async function createWorkspace(data: WorkspaceSchemaValues): Promise<Workspace> {
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

  const {data: newWorkspace, error: workspaceError} = await supabase
    .from("workspaces")
    .insert({
      ...data, 
      owner_id: user.id, 
      position: newPosition
    })
    .select("*")
    .single()

  if (workspaceError) throw workspaceError

  const {error: columnError} = await supabase
    .from("columns")
    .insert({
      title: "Todos",
      border: COLUMN_COLORS[0].border,
      position: 0,
      workspace_id: newWorkspace.id
    })

   if (columnError) throw columnError 

   return mapWorkspace(newWorkspace)
}

export async function updateWorkspace(id: string, data: Partial<WorkspaceSchemaValues>) {
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