"use server"

import {
  Task,
  TaskSchemaValues,
  TaskWithJoins,
  mapTask,
} from "@/features/task-management";
import { createServerClient } from "@/shared/lib/supabase/server";

export async function getTasks(workspaceId: string): Promise<Task[]> {
  const supabase = await createServerClient();

  const {data, error } = await supabase
    .from("tasks")
    .select(
      `
    *, 
    task_assignees:task_assignees(
      assignee:assignees(*)
    ),
    task_tags:task_tags(
      tag:tags(*)
    )
    `
    )
    .eq("workspace_id", workspaceId)
    .order("position", { ascending: true })

  if (error) throw error;

  const tasks = ((data as TaskWithJoins[]) || []).map(mapTask);

  return tasks;
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
      due_date: data.dueDate,
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
      due_date: data.dueDate,
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