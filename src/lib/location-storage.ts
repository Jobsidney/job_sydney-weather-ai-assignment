import type { CityPreset } from '@/lib/constants'

export const LOCATION_INIT_KEY = 'weather-ai-location-init'
const LOCATION_KEY = 'weather-ai-location'

export function hasInitializedLocation(): boolean {
  return localStorage.getItem(LOCATION_INIT_KEY) === '1'
}

export function markLocationInitialized(): void {
  localStorage.setItem(LOCATION_INIT_KEY, '1')
}

export function loadSavedLocation(): CityPreset | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CityPreset
    if (
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.lat === 'number' &&
      typeof parsed.lon === 'number' &&
      typeof parsed.country === 'string'
    ) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

export function saveLocation(location: CityPreset): void {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(location))
  markLocationInitialized()
}
