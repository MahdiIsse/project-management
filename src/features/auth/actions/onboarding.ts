"use server"

import { createServerClient } from "@/shared/lib/supabase/server"

// 🎯 Interface voor onze RPC response
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
  console.log('🚀 Starting RPC onboarding for user:', userId)
  
  const supabase = await createServerClient()
  
  // 🔧 Nu met proper typing via database types
  const { data, error } = await supabase.rpc('setup_user_onboarding', {
    user_id: userId
  })

  if (error) {
    console.error('❌ RPC onboarding failed:', error)
    throw error
  }
  
  const response = data as unknown as OnboardingResponse
  
  if (!response?.success) {
    console.error('❌ Onboarding returned failure:', response)
    throw new Error(response?.error || 'Unknown onboarding error')
  }
  
  console.log('🎉 RPC onboarding completed successfully:', response)
  return response
}