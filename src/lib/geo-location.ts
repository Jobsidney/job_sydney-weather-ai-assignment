import { CITY_PRESETS, type CityPreset } from '@/lib/constants'
import { countryLabel } from '@/lib/countries'
import type { IpLookupResponse } from '@/types/location.schema'
import type { WeatherGeoResponse } from '@/types/weather.schema'

function nearestPreset(lat: number, lon: number): CityPreset | undefined {
  let closest: CityPreset | undefined
  let minDistance = Infinity

  for (const city of CITY_PRESETS) {
    const distance = Math.abs(lat - city.lat) + Math.abs(lon - city.lon)
    if (distance < minDistance) {
      minDistance = distance
      closest = city
    }
  }

  return minDistance < 2 ? closest : undefined
}

export function geoResponseToCityPreset(data: WeatherGeoResponse): CityPreset {
  const { location } = data
  const country = location.country ?? data.ip_geo?.country ?? ''
  const preset = nearestPreset(location.lat, location.lon)

  if (preset) {
    return { ...preset }
  }

  const regionName = countryLabel(country) ?? country

  return {
    id: 'geo-detected',
    name: regionName || 'Your Location',
    country,
    lat: location.lat,
    lon: location.lon,
  }
}

export function ipLookupToCityPreset(data: IpLookupResponse): CityPreset {
  const { geo } = data
  const preset = nearestPreset(geo.lat, geo.lon)

  return {
    id: `ip-${data.ip_hash ?? geo.lat}`,
    name: geo.city ?? preset?.name ?? 'Detected Location',
    country: geo.country ?? preset?.country ?? '',
    lat: geo.lat,
    lon: geo.lon,
  }
}

const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/

export function isIpAddress(query: string): boolean {
  const trimmed = query.trim()
  return trimmed === 'auto' || IPV4_RE.test(trimmed)
}
