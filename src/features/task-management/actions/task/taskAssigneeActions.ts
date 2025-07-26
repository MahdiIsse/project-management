"use server"

import {createServerClient} from "@/shared/lib/supabase/server"



export async function addAssigneeToTask(taskId: string, assigneeId: string) {
  const supabase = await createServerClient()

  const {error} = await supabase
    .from("task_assignees")
    .insert({task_id: taskId, assignee_id: assigneeId})

  if (error) throw error
}

export async function removeAssigneeFromTask(taskId: string, assigneeId: string) {
  const supabase = await createServerClient()

  const {error} = await supabase
    .from("task_assignees")
    .delete()
    .eq("task_id", taskId)
    .eq("assignee_id", assigneeId)

  if (error) throw error
} 