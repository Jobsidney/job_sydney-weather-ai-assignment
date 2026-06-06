import { Skeleton } from '@/components/ui/skeleton'
import { formatTemperatureValue, weatherIconUrl } from '@/lib/formatters'
import { conditionLabel } from '@/lib/conditions'
import { buildTodayOutlook, type OutlookPeriod } from '@/lib/today-outlook'
import type { WeatherResponse } from '@/types/weather.schema'

type TodayOutlookProps = {
  data?: WeatherResponse
  locationName: string
  isLoading: boolean
}

export function TodayOutlook({
  data,
  locationName,
  isLoading,
}: TodayOutlookProps) {
  if (isLoading && !data) {
    return (
      <div className="hero-right">
        <Skeleton className="h-52 w-52 rounded-full mx-auto mb-12" />
        <Skeleton className="h-5 w-72 mx-auto mb-6" />
        <div className="hero-outlook-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="hero-right">
        <p className="hero-right__outlook-title">Forecast unavailable.</p>
      </div>
    )
  }

  const periods = buildTodayOutlook(data.hourly, data.current.time)

  return (
    <div className="hero-right">
      <div className="hero-right__illustration">
        <img
          src={weatherIconUrl(data.current.icon, 128)}
          alt={conditionLabel(data.current.condition_code)}
          className="hero-right__weather-icon"
          width={128}
          height={128}
          decoding="sync"
          loading="eager"
        />
      </div>

      <div className="hero-right__outlook">
        <h3 className="hero-right__outlook-title">
          Today&apos;s Forecast for {locationName}
        </h3>

        <div className="hero-outlook-grid">
          {periods.map((period) => (
            <OutlookCard key={period.label} period={period} />
          ))}
        </div>
      </div>
    </div>
  )
}

function OutlookCard({ period }: { period: OutlookPeriod }) {
  return (
    <div className="hero-outlook-card">
      <span className="hero-outlook-card__label">{period.label}</span>
      <span className="hero-outlook-card__temp">
        {formatTemperatureValue(period.temperature)}°
      </span>
      {period.icon ? (
        <img
          src={period.icon}
          alt={conditionLabel(period.conditionCode)}
          className="hero-outlook-card__icon"
        />
      ) : (
        <span className="hero-outlook-card__icon hero-outlook-card__icon--empty" />
      )}
    </div>
  )
}
