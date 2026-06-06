import { z } from 'zod'

export const ipLookupResponseSchema = z.object({
  ip: z.string().optional(),
  ip_hash: z.string().optional(),
  ip_version: z.string().optional(),
  geo: z.object({
    lat: z.number(),
    lon: z.number(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
    timezone: z.string().optional(),
  }),
})

export type IpLookupResponse = z.infer<typeof ipLookupResponseSchema>

const geocodeResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country_code: z.string(),
  admin1: z.string().optional(),
})

export const locationSearchResponseSchema = z.object({
  results: z.array(geocodeResultSchema).optional(),
})

export type LocationSearchResult = z.infer<typeof geocodeResultSchema>
