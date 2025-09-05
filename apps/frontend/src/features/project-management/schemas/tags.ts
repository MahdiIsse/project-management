import {z} from "zod"

export const tagSchema = z.object({
  name: z.string().min(2, "Tag moet minstens 2 karakters hebben"),
  color: z.string().min(2),
})

export type TagSchemaValues = z.infer<typeof tagSchema>
