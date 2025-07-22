"use server"

import {createClient} from "@/lib/supabase/server"
import type {Workspace} from "@/types"
import {WorkspaceSchemaValues } from "@/schemas/workspace"
import {getAuthenticatedUser} from "@/lib/auth"
import {mapWorkspace} from "@/mappings"

export async function getWorkspaces(): Promise<Workspace[]> {
  const supabase = await createClient()

  const {data, error} = await supabase.from("workspaces").select("*")

  if (error) throw error
  return (data || []).map(mapWorkspace)
}


export async function createWorkspace(data: WorkspaceSchemaValues) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  const {error} = await supabase.from("workspaces").insert({...data, owner_id: user.id})

  if (error) throw error
}

export async function updateWorkspace(id: string, data: WorkspaceSchemaValues) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  const {error} = await supabase.from("workspaces").update({...data}).eq("id", id).eq("owner_id", user.id)

  if (error) throw error
}

export async function deleteWorkspace(id: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("workspaces").delete().eq("id", id).eq("owner_id", user.id)

  if (error) throw error
}