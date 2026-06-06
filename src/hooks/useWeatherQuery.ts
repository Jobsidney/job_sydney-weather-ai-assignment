import { useQuery } from '@tanstack/react-query'
import { isFeatureNotAvailableError } from '@/api/errors'
import { DEFAULT_FORECAST_DAYS } from '@/lib/constants'
import { queryKeys } from '@/lib/query-keys'
import {
  getForecast14,
  getInsights,
  getWeather,
  getWeatherByGeo,
} from '@/services/weather.service'
import type { WeatherQueryParams } from '@/types/weather.schema'

type WeatherQueryOptions = {
  enabled?: boolean
}

export function useWeatherQuery(
  params: WeatherQueryParams,
  options: WeatherQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.weather(params),
    queryFn: () => getWeather({ days: DEFAULT_FORECAST_DAYS, ...params }),
    enabled: options.enabled ?? (params.lat != null && params.lon != null),
    placeholderData: (previous) => previous,
  })
}

export function useForecast14Query(
  params: WeatherQueryParams,
  options: WeatherQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.forecast14(params),
    queryFn: () => getForecast14({ days: 14, ...params }),
    enabled: options.enabled ?? (params.lat != null && params.lon != null),
    retry: (_, error) => !isFeatureNotAvailableError(error),
  })
}

export function useInsightsQuery(
  params: WeatherQueryParams,
  options: WeatherQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.insights(params),
    queryFn: () => getInsights({ days: DEFAULT_FORECAST_DAYS, ...params }),
    enabled: options.enabled ?? (params.lat != null && params.lon != null),
    retry: (_, error) => !isFeatureNotAvailableError(error),
  })
}

export function useWeatherGeoQuery(
  params: Omit<WeatherQueryParams, 'lat' | 'lon'> & { ip?: string },
  options: WeatherQueryOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.weatherGeo(params),
    queryFn: () => getWeatherByGeo(params),
    enabled: options.enabled ?? false,
  })
}
