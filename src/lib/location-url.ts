import { DEFAULT_CITY, type CityPreset } from '@/lib/constants'

export function readLocationFromUrl(): CityPreset | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const lat = Number(params.get('lat'))
  const lon = Number(params.get('lon'))
  const name = params.get('city')
  const country = params.get('country')

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !name || !country) {
    return null
  }

  return {
    id: params.get('id') ?? `url-${lat}-${lon}`,
    name,
    country,
    lat,
    lon,
  }
}

export function writeLocationToUrl(location: CityPreset): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  params.set('lat', String(location.lat))
  params.set('lon', String(location.lon))
  params.set('city', location.name)
  params.set('country', location.country)
  params.set('id', location.id)

  const next = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState(null, '', next)
}

export function getInitialLocation(): CityPreset {
  return readLocationFromUrl() ?? DEFAULT_CITY
}
