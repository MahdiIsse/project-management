"use server"

import {createClient} from "@/lib/supabase/server"
import {getAuthenticatedUser} from "@/lib/auth"
import type {Assignee} from "@/types"
import {mapAssignee} from "@/mappings"

export async function getTaskAssignees(taskId: string): Promise<Assignee[]> {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  const {data: taskAssigneeData, error: taskAssigneeError} = await supabase
    .from("task_assignees")
    .select("assignee_id")
    .eq("task_id", taskId)

  if (taskAssigneeError) throw taskAssigneeError

  if (!taskAssigneeData || taskAssigneeData.length === 0) {
    return []
  }

  const assigneeIds = taskAssigneeData.map(item => item.assignee_id)
  
  const {data: assigneesData, error: assigneesError} = await supabase
    .from("assignees")
    .select("*")
    .in("id", assigneeIds)
    .eq("owner_id", user.id)

  if (assigneesError) throw assigneesError

  return (assigneesData || []).map(mapAssignee)
}

export async function addAssigneeToTask(taskId: string, assigneeId: string) {
  const supabase = await createClient()

  const {error} = await supabase
    .from("task_assignees")
    .insert({task_id: taskId, assignee_id: assigneeId})

  if (error) throw error
}

export async function removeAssigneeFromTask(taskId: string, assigneeId: string) {
  const supabase = await createClient()

  const {error} = await supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", taskId)
    .eq("assignee_id", assigneeId)

  if (error) throw error
} 