import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { QueryErrorAlert } from '@/components/shared/QueryErrorAlert'
import { getInsights } from '@/services/weather.service'
import { queryKeys } from '@/lib/query-keys'
import { FeatureNotAvailableError } from '@/api/errors'
import type { WeatherUnits } from '@/types/weather.schema'

type ProInsightsSectionProps = {
  lat: number
  lon: number
  units: WeatherUnits
}

export function ProInsightsSection({ lat, lon, units }: ProInsightsSectionProps) {
  const {
    data: insights,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.insights({ lat, lon, units }),
    queryFn: () => getInsights({ lat, lon, units, days: 1, ai: true }),
    retry: (failureCount, err) => {
      if (err instanceof FeatureNotAvailableError) return false
      return failureCount < 3
    },
  })

  if (error instanceof FeatureNotAvailableError) {
    return (
      <section className="clean-section">
        <h2 className="section-title">Insights</h2>
        <div className="pro-gate">
          <p className="pro-gate__text">
            Extended insights include risk factors, activity recommendations, and
            trend analysis for your location.
          </p>
          <UpgradePrompt
            title="Insights unavailable on Free"
            description="Upgrade to access detailed weather insights, risks, and personalized recommendations."
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
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-16 w-full mb-3" />
        <Skeleton className="h-16 w-full mb-3" />
        <Skeleton className="h-16 w-full" />
      </section>
    )
  }

  if (!insights?.insights) return null

  const { summary, risks, recommendations } = insights.insights

  return (
    <section className="clean-section">
      <h2 className="section-title">Insights</h2>
      <div className="content-panel insights-panel">
        {summary && (
          <div className="insights-block">
            <h3 className="insights-block__title">Summary</h3>
            <p className="insights-block__body">{summary}</p>
          </div>
        )}

        {risks && risks.length > 0 && (
          <div className="insights-block">
            <h3 className="insights-block__title">Risks</h3>
            <ul className="insights-list">
              {risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="insights-block">
            <h3 className="insights-block__title">Recommendations</h3>
            <ul className="insights-list">
              {recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
