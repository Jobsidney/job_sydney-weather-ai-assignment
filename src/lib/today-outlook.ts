import type { HourlyForecast } from '@/types/weather.schema'

export type OutlookPeriod = {
  label: string
  temperature: number
  icon: string
  conditionCode: string
}

const PERIODS = [
  { label: 'Morning', start: 6, end: 11 },
  { label: 'Afternoon', start: 12, end: 17 },
  { label: 'Evening', start: 18, end: 21 },
  { label: 'Overnight', start: 22, end: 5 },
] as const

function extractHour(timeStr: string): number {
  const match = timeStr.match(/T(\d{2})/)
  return match ? parseInt(match[1], 10) : new Date(timeStr).getHours()
}

function matchesPeriod(hour: number, start: number, end: number): boolean {
  if (start <= end) return hour >= start && hour <= end
  return hour >= start || hour <= end
}

export function buildTodayOutlook(
  hourly: HourlyForecast[],
  currentTime?: string,
): OutlookPeriod[] {
  const todayKey = currentTime
    ? currentTime.slice(0, 10)
    : hourly[0]?.time.slice(0, 10) ?? ''

  const todayHours = hourly.filter((entry) => entry.time.startsWith(todayKey))
  const pool = todayHours.length > 0 ? todayHours : hourly.slice(0, 24)

  return PERIODS.map(({ label, start, end }) => {
    const match =
      pool.find((entry) => matchesPeriod(extractHour(entry.time), start, end)) ??
      hourly.find((entry) => matchesPeriod(extractHour(entry.time), start, end))

    if (!match) {
      return { label, temperature: 0, icon: '', conditionCode: '0' }
    }

    return {
      label,
      temperature: match.temperature,
      icon: match.icon,
      conditionCode: match.condition_code,
    }
  })
}
