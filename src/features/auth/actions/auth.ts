"use server"

import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import {createServerClient} from "@/shared/lib/supabase/server"
import {LoginSchemaValues, SignUpSchemaValues} from "@/features/auth/schemas/auth"

export async function login(data: LoginSchemaValues) {
  const supabase = await createServerClient()

  const {error} = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
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
    throw new Error ("Afbeelding mislukt met uploaden")
  }

  const {data: publicUrlData} = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)
    avatarUrl = publicUrlData.publicUrl

  }

  const {error} = await supabase.auth.signUp({
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
    redirect("/error")
  }
  
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function logout(){
  const supabase = await createServerClient()
  await supabase.auth.signOut()
}