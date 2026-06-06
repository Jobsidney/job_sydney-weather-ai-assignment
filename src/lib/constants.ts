export type CityPreset = {
  id: string
  name: string
  lat: number
  lon: number
  country: string
}

export const DEFAULT_CITY: CityPreset = {
  id: 'sydney',
  name: 'Sydney',
  lat: -33.8688,
  lon: 151.2093,
  country: 'AU',
}

export const CITY_PRESETS: CityPreset[] = [
  DEFAULT_CITY,
  {
    id: 'melbourne',
    name: 'Melbourne',
    lat: -37.8136,
    lon: 144.9631,
    country: 'AU',
  },
  {
    id: 'brisbane',
    name: 'Brisbane',
    lat: -27.4698,
    lon: 153.0251,
    country: 'AU',
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    lat: -1.2921,
    lon: 36.8219,
    country: 'KE',
  },
]

export const DEFAULT_FORECAST_DAYS = 7
