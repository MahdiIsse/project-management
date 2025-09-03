import {z} from "zod"

export const taskSchema = z.object({
  title: z.string().min(2, "Titel moet minstens 2 karakters hebben"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().optional().nullable(),
  columnId: z.string(),
  position: z.number().optional(),
  assigneeIds: z.array(z.string()),
  tagIds: z.array(z.string())
})

export type TaskSchemaValues = z.infer<typeof taskSchema>
