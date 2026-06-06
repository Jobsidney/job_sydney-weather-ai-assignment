import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { QueryErrorAlert } from '@/components/shared/QueryErrorAlert'
import { extractAiSummary, getInsights } from '@/services/weather.service'
import { buildBasicInsights } from '@/lib/basic-insights'
import { queryKeys } from '@/lib/query-keys'
import { FeatureNotAvailableError } from '@/api/errors'
import type { WeatherResponse, WeatherUnits } from '@/types/weather.schema'

type ProInsightsSectionProps = {
  lat: number
  lon: number
  units: WeatherUnits
  weatherData?: WeatherResponse
}

type InsightContent = {
  summary?: string
  risks?: string[]
  recommendations?: string[]
  aiSummary?: string
  sourceLabel?: string
}

function InsightsPanel({ content }: { content: InsightContent }) {
  const { summary, risks, recommendations, aiSummary, sourceLabel } = content

  return (
    <div className="content-panel insights-panel">
      {sourceLabel && <p className="insights-panel__source">{sourceLabel}</p>}

      {aiSummary && (
        <div className="insights-block">
          <h3 className="insights-block__title">Today&apos;s AI Summary</h3>
          <p className="insights-block__body">{aiSummary}</p>
        </div>
      )}

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
  )
}

function buildFreeTierInsights(
  weatherData: WeatherResponse,
  units: WeatherUnits,
): InsightContent {
  const aiSummary = extractAiSummary(weatherData)
  const basic = buildBasicInsights(weatherData, units)

  if (aiSummary) {
    return {
      aiSummary,
      risks: basic.risks,
      recommendations: basic.recommendations,
      sourceLabel: 'Includes today’s AI summary plus forecast-based risks and tips.',
    }
  }

  return {
    ...basic,
    sourceLabel: 'Generated from your current forecast data on the Free plan.',
  }
}

export function ProInsightsSection({
  lat,
  lon,
  units,
  weatherData,
}: ProInsightsSectionProps) {
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
    const freeContent = weatherData ? buildFreeTierInsights(weatherData, units) : null
    const hasAiSummary = Boolean(freeContent?.aiSummary)

    return (
      <section className="clean-section">
        <h2 className="section-title">Insights</h2>
        <div className="pro-gate">
          {freeContent ? <InsightsPanel content={freeContent} /> : null}
          <p className="pro-gate__text">
            Extended insights include deeper risk factors, activity recommendations, and
            trend analysis for your location.
          </p>
          <UpgradePrompt
            title="Extended insights require Pro"
            description={
              hasAiSummary
                ? 'Upgrade to unlock full AI-generated insights with richer risks, recommendations, and trend analysis.'
                : 'Upgrade to unlock AI-powered insights with personalized risks, recommendations, and trend analysis.'
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
      <InsightsPanel
        content={{
          summary,
          risks,
          recommendations,
        }}
      />
    </section>
  )
}
