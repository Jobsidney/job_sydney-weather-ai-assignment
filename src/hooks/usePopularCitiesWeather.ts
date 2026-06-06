import { useQueries } from '@tanstack/react-query'
import { CITY_PRESETS } from '@/lib/constants'
import { queryKeys } from '@/lib/query-keys'
import { getWeather } from '@/services/weather.service'
import type { CityPreset } from '@/lib/constants'
import type { WeatherUnits } from '@/types/weather.schema'

export type CityWeatherSnapshot = {
  city: CityPreset
  temperature: number
  conditionCode: string
  icon: string
}

export function usePopularCitiesWeather(units: WeatherUnits) {
  const queries = useQueries({
    queries: CITY_PRESETS.map((city) => ({
      queryKey: queryKeys.weather({
        lat: city.lat,
        lon: city.lon,
        units,
        ai: false,
        days: 1,
      }),
      queryFn: () =>
        getWeather({
          lat: city.lat,
          lon: city.lon,
          units,
          ai: false,
          days: 1,
        }),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const snapshots: CityWeatherSnapshot[] = queries
    .map((query, index) => {
      if (!query.data) return null
      const city = CITY_PRESETS[index]
      return {
        city,
        temperature: query.data.current.temperature,
        conditionCode: query.data.current.condition_code,
        icon: query.data.current.icon,
      }
    })
    .filter((item): item is CityWeatherSnapshot => item != null)

  return {
    snapshots,
    isLoading: queries.some((query) => query.isLoading),
  }
}
