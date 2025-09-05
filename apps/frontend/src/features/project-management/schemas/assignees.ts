import {z} from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]

export const assigneeSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  avatarFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Maximale bestandsgrootte is 5MB`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Alleen .jpg, .jpeg, .png en .webp bestanden worden geaccepteerd"
    )
}
)

export type AssigneeSchemaValues = z.infer<typeof assigneeSchema>

