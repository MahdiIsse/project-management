"use server"

import {mapColumn, Column, ColumnSchemaValues} from "@/features/task-management"
import {createServerClient} from "@/shared/lib/supabase/server"

export async function getColumns(workspaceId: string): Promise<Column[]> {
const supabase = await createServerClient();

const {data, error} = await supabase.from("columns").select("*").eq("workspace_id", workspaceId)
if (error) throw error
return (data || []).map(mapColumn)
}

export async function createColumn(id: string, data: ColumnSchemaValues) {
  const supabase = await createServerClient()

  const { error} = await supabase.from("columns").insert({...data, workspace_id: id })
  if (error) throw error
}

export async function updateColumn(id: string, data: ColumnSchemaValues) {
  const supabase = await createServerClient()
  const {error} = await supabase.from("columns").update({...data}).eq("id", id)
  if (error) throw error
}

export async function deleteColumn(id:string) {
  const supabase = await createServerClient()
  const {error} = await supabase.from("columns").delete().eq("id",id)
  if (error) throw error
}

export async function updateColumnPositions(updates: {id: string, position: number}[]) {
  const supabase = await createServerClient()

  for (const {id, position} of updates) {
    const {error} = await supabase
      .from("columns")
      .update({position})
      .eq("id", id)
    
      if (error) throw error
  }
}