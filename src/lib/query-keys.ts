import type { WeatherQueryParams } from '@/types/weather.schema'

export const queryKeys = {
  weather: (params: WeatherQueryParams) => ['weather', params] as const,
  weatherGeo: (params: Omit<WeatherQueryParams, 'lat' | 'lon'> & { ip?: string }) =>
    ['weather-geo', params] as const,
  forecast14: (params: WeatherQueryParams) => ['forecast14', params] as const,
  insights: (params: WeatherQueryParams) => ['insights', params] as const,
  usage: () => ['usage'] as const,
}
