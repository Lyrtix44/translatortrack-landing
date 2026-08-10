// lib/ai/schemas.ts
import { z } from "zod"

export const ParsedProjectSchema = z.object({
  title: z.string().min(1).optional().default("Untitled Project"),
  source_language: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().min(1).max(2))
    .optional()
    .default("EN"),
  target_language: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().min(1).max(2))
    .optional()
    .default(""),
  word_count: z
    .union([z.number().int().positive(), z.string().transform((v) => parseInt(v, 10))])
    .nullable()
    .transform((v) => (v === null || v === undefined ? null : Number(v))),
  deadline: z.string().nullable().optional().default(null),
  rate_hint: z
    .union([z.number().positive(), z.string().transform((v) => parseFloat(v))])
    .nullable()
    .transform((v) => (v === null || v === undefined ? null : Number(v))),
  client_name_guess: z.string().nullable().optional().default(null),
  confidence_notes: z.string().nullable().optional().default(""),
})

export type ParsedProject = z.infer<typeof ParsedProjectSchema>