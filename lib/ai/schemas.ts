// lib/ai/schemas.ts
import { z } from "zod"

export const ParsedProjectSchema = z.object({
  title: z.string().min(1),
  source_language: z.string().length(2),
  target_language: z.string().length(2),
  word_count: z.number().int().positive().nullable(),
  deadline: z.string().nullable(),
  rate_hint: z.number().positive().nullable(),
  client_name_guess: z.string().nullable(),
  confidence_notes: z.string(),
})

export type ParsedProject = z.infer<typeof ParsedProjectSchema>