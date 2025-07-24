"use server"

import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import {createClient} from "@/shared/lib/supabase/server"
import {LoginSchemaValues} from "@/features/auth/schemas/auth"

export async function login(data: LoginSchemaValues) {
  const supabase = await createClient()

  const {error} = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const {error} = await supabase.auth.signUp(data)

  if (error) {
    redirect("/error")
  }
  
  revalidatePath("/", "layout")
  redirect("/")
}