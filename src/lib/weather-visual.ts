export type WeatherVisual =
  | 'clear'
  | 'mainly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'showers'
  | 'thunder'

export function weatherVisualFromCode(code: string): WeatherVisual {
  const value = Number.parseInt(code, 10)
  if (value === 0) return 'clear'
  if (value === 1) return 'mainly-clear'
  if (value === 2) return 'partly-cloudy'
  if (value === 3) return 'overcast'
  if (value === 45 || value === 48) return 'fog'
  if (value >= 51 && value <= 55) return 'drizzle'
  if (value >= 61 && value <= 65) return 'rain'
  if (value >= 71 && value <= 75) return 'snow'
  if (value >= 80 && value <= 82) return 'showers'
  if (value >= 95) return 'thunder'
  return 'partly-cloudy'
}

export function isNightWeather(iconUrl?: string, time?: string): boolean {
  if (iconUrl?.includes('night')) return true
  if (iconUrl?.includes('day')) return false

  if (time) {
    const match = time.match(/T(\d{2})/)
    const hour = match ? Number.parseInt(match[1], 10) : new Date(time).getHours()
    return hour < 6 || hour >= 20
  }

  return false
}

export function periodIsNight(label: string): boolean | undefined {
  if (label === 'Overnight') return true
  if (label === 'Morning' || label === 'Afternoon') return false
  return undefined
}
