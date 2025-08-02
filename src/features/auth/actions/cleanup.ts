"use server"

import { createServerClient } from "@/shared/lib/supabase/server"
import { getAuthenticatedUser } from "@/features/auth/lib/auth"

interface CleanupResponse {
  success: boolean
  message: string
  deleted?: {
    workspaces: number
    tasks: number
    assignees: number
    tags: number
  }
  error?: string
}

export async function cleanupUserData() {
  const user = await getAuthenticatedUser()
  const supabase = await createServerClient()
  
  const { data, error } = await supabase.rpc('cleanup_user_data', {
    user_id: user.id
  })

  if (error) {
    throw error
  }
  
  const response = data as unknown as CleanupResponse
  
  if (!response?.success) {
    throw new Error(response?.error || 'Onbekende cleanup fout')
  }
  
  return response
}