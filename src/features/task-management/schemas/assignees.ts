import {z} from "zod"

export const assigneeSchema = z.object({
  name: z.string().min(2)
}
)

export type AssigneeSchemaValues = z.infer<typeof assigneeSchema>

// Insert: {
//   avatar_url?: string | null
//   created_at?: string | null
//   id?: string
//   name: string
//   owner_id?: string | null