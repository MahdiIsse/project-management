"use server"

import { createServerClient } from "@/shared/lib/supabase/server"

interface OnboardingResponse {
  success: boolean
  message: string
  data?: {
    workspaces_created: number
    assignees_created: number
    tags_created: number
    total_columns: number
    total_tasks: number
    total_assignments: number
    total_tag_relations: number
    workspace_ids: string[]
  }
  error?: string
  error_code?: string
}

export async function setupDummyDataForNewUser(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.rpc('setup_user_onboarding', {
    user_id: userId
  })

  if (error) {
    throw error
  }
  
  const response = data as unknown as OnboardingResponse
  
  if (!response?.success) {
    throw new Error(response?.error || 'Onbekende error')
  }
  
  return response
}