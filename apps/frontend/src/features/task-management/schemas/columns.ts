import {z} from "zod"

export const columnSchema = z.object({
  title: z.string().min(2, "Kolom naam moet minstens 2 karakters hebben"),
  color: z.string().min(1, "Kies een kleur")
})

export type ColumnSchemaValues = z.infer<typeof columnSchema>
