import { z } from 'zod'

export const usageResponseSchema = z.object({
  plan: z.enum(['free', 'pro', 'scale']),
  period: z.object({
    start: z.string(),
    end: z.string(),
    requestCount: z.number(),
    aiRequestCount: z.number(),
  }),
  limits: z.object({
    requests: z.number(),
    aiRequests: z.number(),
    maxDays: z.number(),
    webhooks: z.boolean(),
    teamSeats: z.number(),
    sms: z.boolean(),
  }),
  remaining: z.object({
    requests: z.number(),
    aiRequests: z.number(),
  }),
})

export type UsageResponse = z.infer<typeof usageResponseSchema>
export type PlanTier = UsageResponse['plan']
