import type { WeatherUnits } from '@/types/weather.schema'

export function formatTemperature(value: number, units: WeatherUnits): string {
  return units === 'imperial' ? `${Math.round(value)}°F` : `${Math.round(value)}°C`
}

export function formatTemperatureValue(value: number): string {
  return `${Math.round(value)}`
}

export function formatTemperatureUnit(units: WeatherUnits): string {
  return units === 'imperial' ? '°F' : '°C'
}

export function formatSunTime(timeStr: string): string {
  if (!timeStr || timeStr === 'Invalid Date') {
    return '--'
  }
  
  // Handle time-only format like "06:54"
  if (timeStr.includes(':') && !timeStr.includes('T')) {
    return timeStr
  }
  
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) {
    return '--'
  }
  
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatObservedAt(timeStr: string, timezone: string): string {
  if (!timeStr || timeStr === 'Invalid Date') {
    return 'As of 9:00 PM Sydney'
  }
  
  const date = new Date(timeStr)
  if (isNaN(date.getTime())) {
    return 'As of 9:00 PM Sydney'
  }
  
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  const tzShort = timezone?.split('/').pop()?.replace(/_/g, ' ') ?? 'Local'
  return `As of ${time} ${tzShort}`
}

export function formatHighLow(
  max: number | undefined,
  min: number | undefined,
): string {
  const hi = max != null ? `${Math.round(max)}°` : '--'
  const lo = min != null ? `${Math.round(min)}°` : '--'
  return `${hi} / ${lo}`
}

export function formatWindSpeed(value: number, units: WeatherUnits): string {
  return units === 'imperial' ? `${Math.round(value)} mph` : `${Math.round(value)} km/h`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function formatDailyRowDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
  const day = date.getDate().toString().padStart(2, '0')
  return `${weekday} ${day}`
}

export function formatDailyHighLow(max: number, min: number): string {
  return `${Math.round(max)}°/${Math.round(min)}°`
}

export function formatHourLabel(timeStr: string): string {
  const date = new Date(timeStr)
  return date.toLocaleTimeString(undefined, { hour: 'numeric' })
}

export function weatherIconUrl(url: string, size: 64 | 128 = 128): string {
  if (!url) return url
  return url.replace(/\/(\d+)x(\d+)\//, `/${size}x${size}/`)
}

export function formatForecastRowDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  const dayMonth = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
  return `${dayMonth}, ${weekday}`
}

export function formatPressure(value?: number): string {
  return value != null ? `${Math.round(value)} mb` : '--'
}

export function formatVisibility(value?: number, units: WeatherUnits = 'metric'): string {
  if (value == null) return '--'
  return units === 'imperial'
    ? `${Math.round(value * 0.621371)} mi`
    : `${Math.round(value)} km`
}

export function formatUpdatedAt(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}
