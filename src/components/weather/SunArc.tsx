import { Sunrise, Sunset } from 'lucide-react'
import { formatSunTime } from '@/lib/formatters'
import { getSunArcPoint, getSunArcProgress } from '@/lib/sun-arc'

type SunArcProps = {
  sunrise: string
  sunset: string
  currentTime: string
  timezone?: string
}

export function SunArc({ sunrise, sunset, currentTime, timezone }: SunArcProps) {
  const progress = getSunArcProgress(sunrise, sunset, currentTime, timezone)
  const { x, y } = getSunArcPoint(progress)
  const showSun = progress > 0 && progress < 1

  return (
    <div className="hero-detail-top__sun">
      <svg
        className="hero-sun-arc"
        viewBox="0 0 120 64"
        width="120"
        height="64"
        aria-hidden="true"
      >
        <path
          d="M 8 56 A 52 52 0 0 1 112 56"
          fill="none"
          stroke="var(--hero-sun)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {showSun && <circle cx={x} cy={y} r="8" fill="var(--hero-sun)" />}
      </svg>
      <div className="hero-sun-arc__times">
        <span>
          <Sunrise size={12} strokeWidth={1.5} />
          {formatSunTime(sunrise)}
        </span>
        <span>
          <Sunset size={12} strokeWidth={1.5} />
          {formatSunTime(sunset)}
        </span>
      </div>
    </div>
  )
}
