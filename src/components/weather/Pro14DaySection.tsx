import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { QueryErrorAlert } from '@/components/shared/QueryErrorAlert'
import { DailyForecastList } from '@/components/weather/DailyForecastList'
import { TonightOutlook } from '@/components/weather/TonightOutlook'
import { getForecast14 } from '@/services/weather.service'
import { queryKeys } from '@/lib/query-keys'
import { FeatureNotAvailableError } from '@/api/errors'
import type { DailyForecast, HourlyForecast, WeatherUnits } from '@/types/weather.schema'

type Pro14DaySectionProps = {
  lat: number
  lon: number
  units: WeatherUnits
  fallbackDaily?: DailyForecast[]
  fallbackHourly?: HourlyForecast[]
}

export function Pro14DaySection({
  lat,
  lon,
  units,
  fallbackDaily,
  fallbackHourly,
}: Pro14DaySectionProps) {
  const {
    data: forecast14,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.forecast14({ lat, lon, units }),
    queryFn: () => getForecast14({ lat, lon, units, days: 14, ai: false }),
    retry: (failureCount, err) => {
      if (err instanceof FeatureNotAvailableError) return false
      return failureCount < 3
    },
  })

  if (error instanceof FeatureNotAvailableError) {
    const hasFallback = Boolean(fallbackDaily?.length)

    return (
      <section className="clean-section">
        <h2 className="section-title">
          {hasFallback ? '7-Day Forecast' : '14-Day Forecast'}
        </h2>
        <div className="pro-gate">
          {hasFallback ? (
            <div className="forecast-daily-stack">
              {fallbackHourly?.length ? (
                <TonightOutlook
                  hourly={fallbackHourly}
                  daily={fallbackDaily!}
                  units={units}
                />
              ) : null}
              <DailyForecastList days={fallbackDaily!} units={units} />
            </div>
          ) : null}
          <p className="pro-gate__text">
            Plan further ahead with a full two-week outlook including daily highs,
            lows, and precipitation chances.
          </p>
          <UpgradePrompt
            title="14-day forecast requires Pro"
            description={
              hasFallback
                ? 'Your plan includes the 7-day outlook above. Upgrade to unlock the full 14-day forecast.'
                : 'Upgrade to unlock the extended 14-day forecast for your location.'
            }
            plan={error.plan}
            upgradeUrl={error.upgradeUrl}
          />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="clean-section">
        <QueryErrorAlert message={error.message} />
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="clean-section">
        <Skeleton className="h-6 w-44 mb-4" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full mb-2" />
        ))}
      </section>
    )
  }

  if (!forecast14?.daily?.length) return null

  return (
    <section className="clean-section">
      <h2 className="section-title">14-Day Forecast</h2>
      <DailyForecastList days={forecast14.daily} units={units} />
    </section>
  )
}
