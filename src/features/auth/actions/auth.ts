"use server"

import {revalidatePath} from "next/cache"
import {createServerClient} from "@/shared/lib/supabase/server"
import {LoginSchemaValues, SignUpSchemaValues} from "@/features/auth/schemas/auth"
import { setupDummyDataForNewUser } from "./onboarding"

export async function login(data: LoginSchemaValues) {
  const supabase = await createServerClient()

  const {error} = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function signup(data: SignUpSchemaValues) {
  const supabase = await createServerClient()

  let avatarUrl: string | undefined = undefined;

  if (data.avatarFile && data.avatarFile.size > 0) {
    const file = data.avatarFile;
    const fileExtension = file.name.split(".").pop()
    const filePath = `users/${new Date()}_${fileExtension}`
  

  const {error: uploadError} = await supabase.storage
    .from("avatars")
    .upload(filePath, file)

  if (uploadError) {
    throw new Error("Afbeelding mislukt met uploaden")
  }

  const {data: publicUrlData} = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)
    avatarUrl = publicUrlData.publicUrl

  }

  const {data: authData, error} = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        avatar_url: avatarUrl
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }
  
  if (authData.user) {
    try {
      await setupDummyDataForNewUser(authData.user.id);
    } catch (error) {
      console.error("Dummy data setup failed:", error);
    }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function logout(){
  const supabase = await createServerClient()
  await supabase.auth.signOut()
}