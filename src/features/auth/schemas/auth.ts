import {z} from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg", 
  "image/jpg", 
  "image/png", 
  "image/webp"
]

export const loginSchema = z.object({
  email: z.email("Voer een geldige email in"),
  password: z.string().min(8, "Wachtwoord moet minstens 8 karakters hebben")
})

export type LoginSchemaValues = z.infer<typeof loginSchema>

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Volledige naam moet minstens 2 karakters hebben"),
  email: z.email("Voer een geldige email in"),
  password: z.string().min(8, "Wachtwoord moet minstens 8 karakters hebben"),
  confirmPassword: z.string().min(8, "Wachtwoord moet minstens 8 karakters hebben"),
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "De maximale bestandsgrootte is 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type)
    ),
}).refine(data => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"]
})

export type SignUpSchemaValues = z.infer<typeof signUpSchema>