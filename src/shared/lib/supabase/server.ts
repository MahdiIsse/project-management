import { createServerClient as createServerClientSupabase} from "@supabase/ssr"
import {cookies} from "next/headers"
import type {Database} from "@/shared/types/database.types"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClientSupabase<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options)
        )
      } catch {
      }
      }
    }
  })
}