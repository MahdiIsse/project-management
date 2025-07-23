"use server"
import type {Column} from "@/types"
import {mapColumn} from "@/mappings"
import {createClient} from "@/lib/supabase/server"
import {ColumnSchemaValues} from "@/schemas/columns"
import { getAuthenticatedUser } from "@/lib/auth"

export async function getColumns(workspaceId: string): Promise<Column[]> {
const supabase = await createClient();

const {data, error} = await supabase.from("columns").select("*").eq("workspace_id", workspaceId)
if (error) throw error
return (data || []).map(mapColumn)
}

export async function createColumn(id: string, data: ColumnSchemaValues) {
  const supabase = await createClient()

  const { error} = await supabase.from("columns").insert({...data, workspace_id: id })
  if (error) throw error
}

export async function updateColumn(id: string, data: ColumnSchemaValues) {
  const supabase = await createClient()
  const {error} = await supabase.from("columns").update({...data}).eq("id", id)
  if (error) throw error
}

export async function deleteColumn(id:string) {
  const supabase = await createClient()
  const {error} = await supabase.from("columns").delete().eq("id",id)
  if (error) throw error
}

export async function updateColumnPositions(updates: {id: string, position: number}[]) {
  const supabase = await createClient()

  for (const {id, position} of updates) {
    const {error} = await supabase
      .from("columns")
      .update({position})
      .eq("id", id)
    
      if (error) throw error
  }
}