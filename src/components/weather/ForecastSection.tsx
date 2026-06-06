import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DailyForecastList } from '@/components/weather/DailyForecastList'
import { formatHourLabel, formatTemperatureValue, weatherIconUrl } from '@/lib/formatters'
import type { DailyForecast, HourlyForecast, WeatherUnits } from '@/types/weather.schema'

type ForecastSectionProps = {
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  units: WeatherUnits
  isLoading: boolean
  defaultTab?: 'hourly' | 'daily'
}

type ForecastTab = 'hourly' | 'daily'

export function ForecastSection({
  hourly,
  daily,
  units,
  isLoading,
  defaultTab = 'hourly',
}: ForecastSectionProps) {
  const [activeTab, setActiveTab] = useState<ForecastTab>(defaultTab)

  if (isLoading) {
    return (
      <section className="clean-section">
        <Skeleton className="h-6 w-44 mb-4" />
        <Skeleton className="h-10 w-72 mb-6" />
        <div className="forecast-grid forecast-grid--hourly">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-20" />
          ))}
        </div>
      </section>
    )
  }

  const visibleHourly = hourly.slice(0, 24)
  const visibleDaily = daily.slice(0, 7)

  return (
    <section className="clean-section">
      <h2 className="section-title">Weather Forecast</h2>

      <div className="segmented-control" role="tablist" aria-label="Forecast range">
        <span
          className="segmented-control__indicator"
          style={{ transform: activeTab === 'hourly' ? 'translateX(0%)' : 'translateX(100%)' }}
          aria-hidden="true"
        />
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hourly'}
          className={cn(
            'segmented-control__option',
            activeTab === 'hourly' && 'segmented-control__option--active',
          )}
          onClick={() => setActiveTab('hourly')}
        >
          Hourly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'daily'}
          className={cn(
            'segmented-control__option',
            activeTab === 'daily' && 'segmented-control__option--active',
          )}
          onClick={() => setActiveTab('daily')}
        >
          7-Day
        </button>
      </div>

      {activeTab === 'hourly' ? (
        <div className="forecast-grid forecast-grid--hourly">
          {visibleHourly.map((hour) => (
            <HourlyCard key={hour.time} hour={hour} units={units} />
          ))}
        </div>
      ) : (
        <DailyForecastList days={visibleDaily} />
      )}
    </section>
  )
}

function HourlyCard({
  hour,
  units,
}: {
  hour: HourlyForecast
  units: WeatherUnits
}) {
  return (
    <div className="forecast-item">
      <span className="forecast-time">{formatHourLabel(hour.time)}</span>
      <img
        src={weatherIconUrl(hour.icon, 64)}
        alt=""
        className="forecast-icon"
        width={32}
        height={32}
      />
      <span className="forecast-temp">
        {formatTemperatureValue(hour.temperature)}
        {units === 'imperial' ? '°F' : '°C'}
      </span>
      {hour.precipitation_probability != null && hour.precipitation_probability > 0 && (
        <span className="forecast-precip">
          {Math.round(hour.precipitation_probability)}%
        </span>
      )}
    </div>
  )
}
