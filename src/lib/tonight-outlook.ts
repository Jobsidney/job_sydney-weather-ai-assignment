import { conditionLabel } from '@/lib/conditions'
import type { DailyForecast, HourlyForecast } from '@/types/weather.schema'

export type TonightOutlook = {
  label: string
  temperature: number
  conditionCode: string
  icon: string
  precipProbability: number
  windSpeed?: number
  summary: string
  low?: number
}

function hourValue(timeStr: string): number {
  const match = timeStr.match(/T(\d{2})/)
  return match ? Number(match[1]) : new Date(timeStr).getHours()
}

export function buildTonightOutlook(
  hourly: HourlyForecast[],
  daily: DailyForecast[],
  units: 'metric' | 'imperial',
): TonightOutlook | null {
  const tonight = hourly.find((entry) => {
    const hour = hourValue(entry.time)
    return hour >= 18 || hour <= 5
  }) ?? hourly[0]

  const today = daily[0]
  if (!tonight) return null

  const condition = conditionLabel(tonight.condition_code)
  const low = today?.temp_min
  const unit = units === 'imperial' ? '°F' : '°C'
  const lowText = low != null ? ` Low ${Math.round(low)}${unit}.` : ''
  const windText =
    tonight.wind_speed != null
      ? ` Winds ${Math.round(tonight.wind_speed)} ${units === 'imperial' ? 'mph' : 'km/h'}.`
      : ''

  return {
    label: 'Tonight',
    temperature: tonight.temperature,
    conditionCode: tonight.condition_code,
    icon: tonight.icon,
    precipProbability: tonight.precipitation_probability ?? 0,
    windSpeed: tonight.wind_speed,
    low: today?.temp_min,
    summary: `${condition}.${lowText}${windText}`.trim(),
  }
}
