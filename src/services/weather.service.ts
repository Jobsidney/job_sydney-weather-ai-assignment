import { apiGet } from '@/api/client'
import { shouldUseMockData } from '@/config/dev'
import {
  getMockWeather,
  getMockWeatherGeo,
  getMockIpLookup,
  getMockInsights,
  getMockForecast14,
} from './mock.service'
import { ipLookupResponseSchema } from '@/types/location.schema'
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
  if (shouldUseMockData('weather')) {
    return getMockWeather(params.lat, params.lon)
  }
  
  const data = await apiGet<unknown>('/v1/weather', {
    params: toQueryParams(params),
  })
  return weatherResponseSchema.parse(data)
}

export async function getForecast14(params: WeatherQueryParams) {
  if (shouldUseMockData('forecast14')) {
    return getMockForecast14(params.lat, params.lon)
  }
  
  const data = await apiGet<unknown>('/v1/forecast14', {
    params: toQueryParams(params),
  })
  return weatherResponseSchema.parse(data)
}

export async function getInsights(params: WeatherQueryParams) {
  if (shouldUseMockData('insights')) {
    return getMockInsights(params.lat, params.lon)
  }
  
  const data = await apiGet<unknown>('/v1/insights', {
    params: toQueryParams(params),
  })
  return insightsResponseSchema.parse(data)
}

export async function getIpLookup(ip = 'auto') {
  if (shouldUseMockData('weather')) {
    return getMockIpLookup(ip)
  }

  const data = await apiGet<unknown>('/v1/ip-lookup', {
    params: { ip },
  })
  return ipLookupResponseSchema.parse(data)
}

export async function getWeatherByGeo(
  params: Omit<WeatherQueryParams, 'lat' | 'lon'> & { ip?: string },
) {
  if (shouldUseMockData('weather')) {
    return getMockWeatherGeo()
  }

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
