"use server"

import {createClient} from "@/lib/supabase/server"
import {TaskSchemaValues} from "@/schemas/tasks"
import {Task} from "@/types"
import {mapTask} from "@/mappings"

export async function getTasks( workspaceId: string): Promise<Task[]> {
  const supabase = await createClient()

  const {data, error} = await supabase.from('tasks').select("*").eq("workspace_id", workspaceId)

  if (error) throw error

  return (data || []).map(mapTask)
}

export async function createTask(workspaceId: string, data: TaskSchemaValues){
  const supabase = await createClient()

  const {data: maxData} = await supabase
  .from("tasks")
  .select("position")
  .eq("column_id", data.columnId)
  .order("position", {ascending: false})
  .limit(1)
  .single()

  const newPosition = maxData && maxData.position !== null && maxData.position !== undefined
    ? maxData.position + 1
    : 0

  const { error } = await supabase.from("tasks").insert({
    title: data.title,
    column_id: data.columnId,
    description: data.description,
    priority: data.priority,
    due_date: data.dueDate ? data.dueDate.toISOString() : null,
    workspace_id: workspaceId,
  position: newPosition})

  if (error) throw error
}

export async function updateTask(data: Partial<Task>, taskId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tasks")
    .update({
      title: data.title,
      description: data.description,
      column_id: data.columnId,
      due_date: data.dueDate, 
      priority: data.priority,
      position: data.position,
    })
    .eq("id", taskId)

  if (error) throw error
  }
export async function deleteTask(taskId: string) {
  const supabase = await createClient()

  const {error} = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) throw error
}

export async function updateTaskPriority(taskId: string, priority: "Low" | "Medium" | "High") {
  const supabase = await createClient()

  const {error} = await supabase.from("tasks").update({priority}).eq("id", taskId)

  if (error) throw error
}

export async function updateTaskDueDate(taskId: string, dueDate: Date) {
  const supabase = await createClient()

  const {error} = await supabase.from("tasks").update({due_date: dueDate.toLocaleDateString()}).eq("id", taskId)

  if (error) throw error
}

export async function updateTasksPositions(updates: {id: string; columnId: string, position: number}[]) {
  const supabase = await createClient();

  for (const {id, position, columnId} of updates) {
    const {error} = await supabase.from("tasks").update({position, column_id: columnId}).eq("id",id)

    if (error) throw error
  }
}