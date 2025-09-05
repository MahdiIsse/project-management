import { z } from "zod";

export const workspaceSchema = z.object({
  title: z.string().min(2, "Je titel moet minstens 2 karakters hebben"),
  description: z.string().optional(),
  color: z.string().optional(),
  position: z.number().optional()
});

export type WorkspaceSchemaValues = z.infer<typeof workspaceSchema>;