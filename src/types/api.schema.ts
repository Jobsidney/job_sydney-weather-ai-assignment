import { z } from 'zod'

export const proErrorSchema = z.object({
  error: z.string(),
  plan: z.string(),
  upgrade: z.string().url(),
})

export type ProError = z.infer<typeof proErrorSchema>
