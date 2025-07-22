"use server"

import {createClient} from "@/lib/supabase/server"
import {TaskSchemaValues} from "@/schemas/tasks"
import {Task} from "@/types"
import {mapTask} from "@/mappings"

export async function getTasks(columnId: string, workspaceId: string): Promise<Task[]> {
  const supabase = await createClient()

  const {data, error} = await supabase.from('tasks').select("*").eq("column_id", columnId).eq("workspace_id", workspaceId)

  if (error) throw error

  return (data || []).map(mapTask)
}

export async function createTask(workspaceId: string, data: TaskSchemaValues){
  const supabase = await createClient()

  const { error} = await supabase.from("tasks").insert({
    title: data.title,
    column_id: data.columnId,
    description: data.description,
    priority: data.priority,
    due_date: data.dueDate ? data.dueDate.toISOString() : null,
    workspace_id: workspaceId,})

  if (error) throw error
}

export async function updateTask(data: TaskSchemaValues, taskId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tasks")
    .update({
      title: data.title,
      description: data.description,
      column_id: data.columnId,
      due_date: data.dueDate ? data.dueDate.toISOString() : null, 
      priority: data.priority,
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