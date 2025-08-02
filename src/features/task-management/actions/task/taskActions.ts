"use server"

import {
  Task,
  TaskFilterParams,
  TaskSchemaValues, 
  TaskWithJoins, 
  mapTask, 
} from "@/features/task-management"
import { formatDateForDatabase } from "@/shared"
import {createServerClient} from "@/shared/lib/supabase/server"

export async function getTasks(workspaceId: string, filters?: TaskFilterParams): Promise<Task[]> {
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
    `)
    .eq("workspace_id", workspaceId)

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.priorities && filters.priorities.length > 0) {
    query = query.in("priority", filters.priorities)
  }

  query = query.order("position", { ascending: true })

  const { data, error } = await query

  if (error) throw error

  let tasks = (data as TaskWithJoins[] || []).map(mapTask)

  if (filters?.assigneeIds && filters.assigneeIds.length > 0) {
    tasks = tasks.filter((task) => task.assignees.some(assignee => filters.assigneeIds!.includes(assignee.id)))
  }

  return tasks
}

export async function createTask(workspaceId: string, data: TaskSchemaValues) {
  const supabase = await createServerClient()

  const { data: maxData } = await supabase
    .from("tasks")
    .select("position")
    .eq("column_id", data.columnId)
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const newPosition = maxData && maxData.position !== null && maxData.position !== undefined
    ? maxData.position + 1
    : 0

  const { data: taskData, error: taskError } = await supabase
    .from("tasks")
    .insert({
      title: data.title,
      column_id: data.columnId,
      description: data.description,
      priority: data.priority,
      due_date: data.dueDate ? formatDateForDatabase(data.dueDate) : null,
      workspace_id: workspaceId,
      position: newPosition
    })
    .select("id")
    .single()

  if (taskError) throw taskError

  const taskId = taskData.id

  if (data.assigneeIds && data.assigneeIds.length > 0) {
    const assigneeInserts = data.assigneeIds.map(assigneeId => ({
      task_id: taskId,
      assignee_id: assigneeId
    }))

    const { error: assigneeError } = await supabase
      .from("task_assignees")
      .insert(assigneeInserts)

    if (assigneeError) throw assigneeError
  }

  if (data.tagIds && data.tagIds.length > 0) {
    const tagInserts = data.tagIds.map(tagId => ({
      task_id: taskId,
      tag_id: tagId
    }))

    const { error: tagError } = await supabase
      .from("task_tags")
      .insert(tagInserts)

    if (tagError) throw tagError
  }
}

export async function updateTask(data: Partial<TaskSchemaValues>, taskId: string) {
  const supabase = await createServerClient()

  const { error: taskError } = await supabase
    .from("tasks")
    .update({
      title: data.title,
      description: data.description,
      column_id: data.columnId,
      due_date: data.dueDate ? formatDateForDatabase(data.dueDate) : undefined,
      priority: data.priority,
      position: data.position,
    })
    .eq("id", taskId)

  if (taskError) throw taskError

  if (data.assigneeIds !== undefined) {
    const { error: removeAssigneesError } = await supabase
      .from("task_assignees")
      .delete()
      .eq("task_id", taskId)

    if (removeAssigneesError) throw removeAssigneesError

    if (data.assigneeIds.length > 0) {
      const assigneeInserts = data.assigneeIds.map(assigneeId => ({
        task_id: taskId,
        assignee_id: assigneeId
      }))

      const { error: assigneeError } = await supabase
        .from("task_assignees")
        .insert(assigneeInserts)

      if (assigneeError) throw assigneeError
    }
  }

  if (data.tagIds !== undefined) {
    const { error: removeTagsError } = await supabase
      .from("task_tags")
      .delete()
      .eq("task_id", taskId)

    if (removeTagsError) throw removeTagsError

    if (data.tagIds.length > 0) {
      const tagInserts = data.tagIds.map((tagId) => ({
        task_id: taskId,
        tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from("task_tags")
        .insert(tagInserts)

      if (tagError) throw tagError
    }
  }
}

export async function deleteTask(taskId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) throw error
}

export async function updateTasksPositions(updates: { id: string; columnId: string, position: number }[]) {
  const supabase = await createServerClient();

  for (const { id, position, columnId } of updates) {
    const { error } = await supabase.from("tasks").update({ position, column_id: columnId }).eq("id", id)

    if (error) throw error
  }
}