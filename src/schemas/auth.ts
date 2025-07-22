import {z} from "zod"

export const loginSchema = z.object({
  email: z.email("Voer een geldige email in"),
  password: z.string().min(8, "Wachtwoord moet minstens 8 karakters hebben")
})

export type LoginSchemaValues = z.infer<typeof loginSchema>