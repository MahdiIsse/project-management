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

  const {data: newTag, error} = await supabase.from("tags").insert({name: data.name, color_text: data.colorText, color_name: data.colorName, color_bg: data.colorBg, owner_id: user.id}).select().single()

  if (error) throw error

  return mapTag(newTag)
}

export async function updateTag(data: TagSchemaValues, tagId: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("tags").update({name: data.name, color_text: data.colorText, color_name: data.colorName, color_bg: data.colorBg,}).eq("id", tagId).eq("owner_id", user.id)

  if (error) throw error
}

export async function deleteTag(tagId: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()


  const {error} = await supabase.from("tags").delete().eq("id", tagId).eq("owner_id", user.id)

  if (error) throw error
}