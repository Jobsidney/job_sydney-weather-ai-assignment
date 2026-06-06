import { apiGet } from '@/api/client'
import { shouldUseMockData } from '@/config/dev'
import type { CityPreset } from '@/lib/constants'
import {
  locationSearchResponseSchema,
  type LocationSearchResult,
} from '@/types/location.schema'

const MOCK_CITIES: LocationSearchResult[] = [
  { id: 1, name: 'Barcelona', latitude: 41.38879, longitude: 2.15899, country_code: 'ES', admin1: 'Catalonia' },
  { id: 2, name: 'Amsterdam', latitude: 52.37403, longitude: 4.88969, country_code: 'NL', admin1: 'North Holland' },
  { id: 3, name: 'London', latitude: 51.50853, longitude: -0.12574, country_code: 'GB', admin1: 'England' },
  { id: 4, name: 'New York', latitude: 40.71427, longitude: -74.00597, country_code: 'US', admin1: 'New York' },
  { id: 5, name: 'Tokyo', latitude: 35.6895, longitude: 139.69171, country_code: 'JP', admin1: 'Tokyo' },
]

export function locationResultToPreset(result: LocationSearchResult): CityPreset {
  return {
    id: `search-${result.id}`,
    name: result.name,
    country: result.country_code,
    lat: result.latitude,
    lon: result.longitude,
  }
}

async function getMockLocationSearch(query: string): Promise<LocationSearchResult[]> {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  return MOCK_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.country_code.toLowerCase().includes(q) ||
      city.admin1?.toLowerCase().includes(q),
  )
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  if (shouldUseMockData('weather')) {
    return getMockLocationSearch(trimmed)
  }

  const data = await apiGet<unknown>('/v1/search', { params: { q: trimmed } })
  const parsed = locationSearchResponseSchema.parse(data)
  return parsed.results ?? []
}
