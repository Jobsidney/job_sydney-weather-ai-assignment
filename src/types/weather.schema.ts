import { z } from 'zod'

const locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  requested_lat: z.number().optional(),
  requested_lon: z.number().optional(),
  country: z.string().optional(),
})

const currentSchema = z.object({
  time: z.string(),
  temperature: z.number(),
  wind_speed: z.number(),
  wind_direction: z.number().optional(),
  condition_code: z.string(),
  icon: z.string(),
  icon_path: z.string().optional(),
  humidity: z.number().optional(),
  feels_like: z.number().optional(),
  pressure_mb: z.number().optional(),
  visibility_km: z.number().optional(),
  uv_index: z.number().optional(),
})

const hourlySchema = z.object({
  time: z.string(),
  temperature: z.number(),
  precipitation_probability: z.number().optional(),
  wind_speed: z.number().optional(),
  condition_code: z.string(),
  icon: z.string(),
  humidity: z.number().optional(),
  feels_like: z.number().optional(),
  wind_gust: z.number().optional(),
  uv_index: z.number().optional(),
  icon_path: z.string().optional(),
})

const dailySchema = z.object({
  date: z.string(),
  temp_min: z.number(),
  temp_max: z.number(),
  precipitation_sum: z.number().optional(),
  sunrise: z.string().optional(),
  sunset: z.string().optional(),
  condition_code: z.string(),
  icon: z.string(),
  precipitation_probability: z.number().optional(),
  wind_max: z.number().optional(),
  icon_path: z.string().optional(),
})

export const weatherResponseSchema = z.object({
  location: locationSchema,
  current: currentSchema,
  hourly: z.array(hourlySchema),
  daily: z.array(dailySchema),
  ai_summary: z.string().optional(),
  ai: z
    .object({
      summary: z.string().optional(),
      language: z.string().optional(),
    })
    .optional(),
  client_geo: z
    .object({
      country: z.string().optional(),
      ip_hash: z.string().optional(),
    })
    .optional(),
})

export type WeatherResponse = z.infer<typeof weatherResponseSchema>
export type HourlyForecast = z.infer<typeof hourlySchema>
export type DailyForecast = z.infer<typeof dailySchema>

export const weatherGeoResponseSchema = weatherResponseSchema.extend({
  ip_geo: z
    .object({
      country: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
      org: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
})

export type WeatherGeoResponse = z.infer<typeof weatherGeoResponseSchema>

export const insightsResponseSchema = weatherResponseSchema.extend({
  insights: z
    .object({
      summary: z.string().optional(),
      risks: z.array(z.string()).optional(),
      recommendations: z.array(z.string()).optional(),
    })
    .optional(),
})

export type InsightsResponse = z.infer<typeof insightsResponseSchema>

export type WeatherUnits = 'metric' | 'imperial'

export type WeatherQueryParams = {
  lat: number
  lon: number
  days?: number
  ai?: boolean
  units?: WeatherUnits
  lang?: string
}
