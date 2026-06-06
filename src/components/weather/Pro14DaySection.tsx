import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { QueryErrorAlert } from '@/components/shared/QueryErrorAlert'
import { DailyForecastList } from '@/components/weather/DailyForecastList'
import { getForecast14 } from '@/services/weather.service'
import { queryKeys } from '@/lib/query-keys'
import { FeatureNotAvailableError } from '@/api/errors'
import type { WeatherUnits } from '@/types/weather.schema'

type Pro14DaySectionProps = {
  lat: number
  lon: number
  units: WeatherUnits
}

export function Pro14DaySection({ lat, lon, units }: Pro14DaySectionProps) {
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
    return (
      <section className="clean-section">
        <h2 className="section-title">14-Day Forecast</h2>
        <div className="pro-gate">
          <p className="pro-gate__text">
            Plan further ahead with a full two-week outlook including daily highs,
            lows, and precipitation chances.
          </p>
          <UpgradePrompt
            title="14-day forecast unavailable on Free"
            description="Upgrade to unlock the extended 14-day forecast for your location."
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
      <DailyForecastList days={forecast14.daily} />
    </section>
  )
}
