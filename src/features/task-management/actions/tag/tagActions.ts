"use server"

import {mapTag, Tag, TagSchemaValues} from "@/features/task-management"
import {getAuthenticatedUser} from "@/features/auth"
import {createServerClient} from "@/shared/lib/supabase/server"

export async function getTags(): Promise<Tag[]> {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data, error} = await supabase
    .from("tags")
    .select("*")
    .eq("owner_id", user.id)

  if (error) throw error

  return (data || []).map(mapTag)
}

export async function createTag(data: TagSchemaValues): Promise<Tag> {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data: newTag, error} = await supabase
    .from("tags")
    .insert({
      name: data.name, 
      color_name: data.colorName, 
      owner_id: user.id
    })
    .select()
    .single()

  if (error) throw error

  return mapTag(newTag)
}

export async function updateTag(data: TagSchemaValues, tagId: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()


  const { error} = await supabase
    .from("tags")
    .update({
      name: data.name, 
      color_name: data.colorName
    }).eq("id", tagId)
      .eq("owner_id", user.id)

  if (error) throw error
  
  const {data: updatedData, error: fetchError} = await supabase
    .from("tags")
    .select("*")
    .eq("id", tagId)
    .single()

  if (fetchError) throw fetchError
  return mapTag(updatedData)
}

export async function deleteTag(tagId: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("tags").delete().eq("id", tagId).eq("owner_id", user.id)

  if (error) throw error
}