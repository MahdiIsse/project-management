"use server"

import {createServerClient} from "@/shared/lib/supabase/server"


export async function addTagToTask(taskId: string, tagId: string) {
  const supabase = await createServerClient()

  const {error} = await supabase.from("task_tags").insert({task_id: taskId, tag_id: tagId})

  if (error) throw error
}

export async function removeTagFromTask(taskId: string, tagId: string) {
  const supabase = await createServerClient()

  const {error} = await supabase.from("task_tags").delete().eq("task_id", taskId).eq("tag_id", tagId)

  if (error) throw error
}