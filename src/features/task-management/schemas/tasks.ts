import {z} from "zod"

export const taskSchema = z.object({
  title: z.string().min(2, "Titel moet minstens 2 karakters hebben"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  dueDate: z.date().optional(),
  columnId: z.string()
})

export type TaskSchemaValues = z.infer<typeof taskSchema>
