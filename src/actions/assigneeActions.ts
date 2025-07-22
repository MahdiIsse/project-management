"use server"

import {AssigneeSchemaValues} from "@/schemas/assignees"
import {createClient} from "@/lib/supabase/server"
import {getAuthenticatedUser} from "@/lib/auth"
import type {Assignee} from "@/types"
import {mapAssignee} from "@/mappings"

export async function getAssignees(): Promise<Assignee[]> {
  const supabase = await createClient()

  const {data, error} = await supabase.from("assignees").select("*")

  if (error) throw error
  
  return (data || []).map(mapAssignee)
}

export async function createAssignee(data: AssigneeSchemaValues) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  const {error} = await supabase.from("assignees").insert({...data, owner_id: user.id})

  if (error) throw error
}

export async function updateAssignee(assigneeId: string, data: AssigneeSchemaValues) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("assignees").update({...data}).eq("id", assigneeId).eq("owner_id", user.id)

  if (error) throw error
}

export async function deleteAssignee(assigneeId: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("assignees").delete().eq("id", assigneeId).eq("owner_id", user.id)

  if (error) throw error
}