"use server"

import {
  Task,
  TaskSchemaValues, 
  TaskWithJoins, 
  mapTask, 
} from "@/features/task-management"
import {createServerClient} from "@/shared/lib/supabase/server"

export async function getTasks( workspaceId: string, filters?: TaskFilters): Promise<Task[]> {
  const supabase = await createServerClient()

  let query = supabase
    .from('tasks')
    .select(`
    *, 
    task_assignees:task_assignees(
    assignee:assignees(*)
  ),
  task_tags:task_tags(
  tag:tags(*)
  )
  `).eq("workspace_id", workspaceId)

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`)
  }

  if (filters?.priorities && filters.priorities.length > 0) {
    query = query.in("priority", filters.priorities)
  }

  if (filters?.assigneeIds && filters.assigneeIds.length > 0) {
    query = query.in("task_assignees.assignee_id", filters.assigneeIds)
  }

  const {data, error} = await query.order("position", {ascending: true}) 

  if (error) throw error

  return (data as TaskWithJoins[] || []).map(mapTask)
}

export async function createTask(workspaceId: string, data: TaskSchemaValues){
  const supabase = await createServerClient()

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
  const supabase = await createServerClient()

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
  const supabase = await createServerClient()

  const {error} = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) throw error
}



export async function updateTasksPositions(updates: {id: string; columnId: string, position: number}[]) {
  const supabase = await createServerClient();

  for (const {id, position, columnId} of updates) {
    const {error} = await supabase.from("tasks").update({position, column_id: columnId}).eq("id",id)

    if (error) throw error
  }
}