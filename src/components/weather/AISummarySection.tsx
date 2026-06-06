import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { extractAiSummary } from '@/services/weather.service'
import type { WeatherResponse } from '@/types/weather.schema'

type AISummarySectionProps = {
  data?: WeatherResponse
  isLoading: boolean
  onRetry?: () => void
}

export function AISummarySection({ data, isLoading, onRetry }: AISummarySectionProps) {
  const aiSummary = data ? extractAiSummary(data) : null

  if (isLoading && !data) {
    return (
      <section className="clean-section">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-20 w-full" />
      </section>
    )
  }

  if (!data) return null

  return (
    <section className="clean-section content-section">
      <h2 className="section-title">Today&apos;s Summary</h2>
      <div className="content-panel">
        {aiSummary ? (
          <p className="content-section__body">{aiSummary}</p>
        ) : (
          <div className="ai-summary-empty">
            <p className="content-section__body">
              No AI summary was returned for this location. This can happen when AI
              quota is exhausted or the forecast provider did not include one.
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" className="w-fit" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
