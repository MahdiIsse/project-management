"use server"

import {Assignee, mapAssignee} from "@/features/task-management"
import {getAuthenticatedUser} from "@/features/auth"
import {createServerClient} from "@/shared/lib/supabase/server"
import { revalidatePath } from "next/cache"


export async function getAssignees(): Promise<Assignee[]> {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data, error} = await supabase
    .from("assignees")
    .select("*")
    .eq("owner_id", user.id)


  if (error) throw error
  
  return (data || []).map(mapAssignee)
}

async function uploadAvatar(file: File) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()
  const filePath = `public/${user.id}/${Date.now()}_${file.name}`

  const {error: uploadError} = await supabase.storage
    .from("avatars")
    .upload(filePath, file)

  if (uploadError) {
    throw new Error ("Avatar upload failed")
  }
  
  const { data: publicUrlData} = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}

export async function createAssignee({formData}: {formData: FormData}) {
  const supabase = await createServerClient()
  const name = formData.get("name") as string;
  const avatarFile = formData.get("avatarFile") as File | null;
  const user = await getAuthenticatedUser()

  let avatarUrl: string | null = null

  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadAvatar(avatarFile)
  }

  const {data, error} = await supabase
    .from("assignees")
    .insert({name, avatar_url: avatarUrl, owner_id: user.id})
    .select()
    .single()

  if (error) throw error
  revalidatePath("/dashboard")

  return mapAssignee(data)
}

export async function updateAssignee({assigneeId, formData}: {
  assigneeId: string, formData: FormData
}) {
  const supabase = await createServerClient()
  const name = formData.get("name") as string
  const avatarFile = formData.get("avatarFile") as File | null
  const user = await getAuthenticatedUser()

  let avatarUrl: string | null = null

  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadAvatar(avatarFile)
  }

  const {error} = await supabase
    .from("assignees")
    .update({name, avatar_url: avatarUrl})
    .eq("id", assigneeId)
    .eq("owner_id", user.id)

  if (error) throw error
  revalidatePath("/dashboard")
}

export async function deleteAssignee(assigneeId: string) {
  const supabase = await createServerClient()
  const user = await getAuthenticatedUser()

  const {data: assignee} = await supabase
    .from("assignees")
    .select("avatar_url")
    .eq("id", assigneeId)
    .single()

    if (assignee?.avatar_url) {
      const fileName = assignee.avatar_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from("avatars").remove([`public/${fileName}`])
      }
    }


  const {error} = await supabase
    .from("assignees")
    .delete()
    .eq("id", assigneeId)
    .eq("owner_id", user.id)

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "Kan niet verwijderen: deze persoon is nog toegewezen aan taken"
      )
    }
    throw new Error("Kon de assignee niet verwijderen")
  }

  revalidatePath("/dashboard")
}