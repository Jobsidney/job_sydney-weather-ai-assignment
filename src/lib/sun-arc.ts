function parseTimeToMinutes(timeStr: string, timezone?: string): number | null {
  if (!timeStr) return null

  if (timeStr.includes(':') && !timeStr.includes('T')) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
    return hours * 60 + minutes
  }

  const date = new Date(timeStr)
  if (Number.isNaN(date.getTime())) return null

  if (timezone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    }).formatToParts(date)
    const hour = Number(parts.find((part) => part.type === 'hour')?.value)
    const minute = Number(parts.find((part) => part.type === 'minute')?.value)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return null
    return hour * 60 + minute
  }

  return date.getHours() * 60 + date.getMinutes()
}

export function getSunArcProgress(
  sunrise: string,
  sunset: string,
  currentTime: string,
  timezone?: string,
): number {
  const start = parseTimeToMinutes(sunrise)
  const end = parseTimeToMinutes(sunset)
  const now = parseTimeToMinutes(currentTime, timezone)

  if (start == null || end == null || now == null || end <= start) {
    return 0.35
  }

  if (now <= start) return 0
  if (now >= end) return 1
  return (now - start) / (end - start)
}

export function getSunArcPoint(progress: number): { x: number; y: number } {
  const t = Math.min(1, Math.max(0, progress))
  const angle = Math.PI * (1 - t)
  const cx = 60
  const cy = 60
  const radius = 52

  return {
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  }
}
