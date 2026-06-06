import { apiGet } from '@/api/client'
import {
  insightsResponseSchema,
  weatherGeoResponseSchema,
  weatherResponseSchema,
  type WeatherQueryParams,
} from '@/types/weather.schema'

function toQueryParams(params: WeatherQueryParams) {
  return {
    lat: params.lat,
    lon: params.lon,
    days: params.days,
    ai: params.ai,
    units: params.units,
    lang: params.lang,
  }
}

export async function getWeather(params: WeatherQueryParams) {
  const data = await apiGet<unknown>('/v1/weather', {
    params: toQueryParams(params),
  })
  return weatherResponseSchema.parse(data)
}

export async function getForecast14(params: WeatherQueryParams) {
  const data = await apiGet<unknown>('/v1/forecast14', {
    params: toQueryParams(params),
  })
  return weatherResponseSchema.parse(data)
}

export async function getInsights(params: WeatherQueryParams) {
  const data = await apiGet<unknown>('/v1/insights', {
    params: toQueryParams(params),
  })
  return insightsResponseSchema.parse(data)
}

export async function getWeatherByGeo(
  params: Omit<WeatherQueryParams, 'lat' | 'lon'> & { ip?: string },
) {
  const data = await apiGet<unknown>('/v1/weather-geo', {
    params: {
      ip: params.ip ?? 'auto',
      days: params.days,
      ai: params.ai,
      units: params.units,
      lang: params.lang,
    },
  })
  return weatherGeoResponseSchema.parse(data)
}

export function extractAiSummary(
  weather: Awaited<ReturnType<typeof getWeather>>,
): string | null {
  return weather.ai_summary ?? weather.ai?.summary ?? null
}
