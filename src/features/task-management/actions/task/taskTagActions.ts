"use server"

import {Tag, mapTag} from "@/features/task-management"
import {getAuthenticatedUser} from "@/features/auth"
import {createServerClient} from "@/shared/lib/supabase/server"

// export async function getTaskTags(taskId: string): Promise<Tag[]> {
//   const supabase = await createServerClient()
//   const user = await getAuthenticatedUser()

//   // Stap 1: Haal alle tag_ids op voor deze task
//   const {data: taskTagData, error: taskTagError} = await supabase
//     .from("task_tags")
//     .select("tag_id")
//     .eq("task_id", taskId)

//   if (taskTagError) throw taskTagError

//   if (!taskTagData || taskTagData.length === 0) {
//     return []
//   }

//   const tagIds = taskTagData.map(item => item.tag_id)
  
//   const {data: tagsData, error: tagsError} = await supabase
//     .from("tags")
//     .select("*")
//     .in("id", tagIds)
//     .eq("owner_id", user.id)

//   if (tagsError) throw tagsError

//   return (tagsData || []).map(mapTag)
// }

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