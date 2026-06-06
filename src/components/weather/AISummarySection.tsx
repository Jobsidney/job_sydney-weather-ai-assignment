import { Skeleton } from '@/components/ui/skeleton'
import { extractAiSummary } from '@/services/weather.service'
import type { WeatherResponse } from '@/types/weather.schema'

type AISummarySectionProps = {
  data?: WeatherResponse
  isLoading: boolean
}

export function AISummarySection({ data, isLoading }: AISummarySectionProps) {
  const aiSummary = data ? extractAiSummary(data) : null

  if (isLoading && !data) {
    return (
      <section className="clean-section">
        <Skeleton className="h-6 w-40 mb-3" />
        <Skeleton className="h-20 w-full" />
      </section>
    )
  }

  if (!aiSummary) return null

  return (
    <section className="clean-section content-section">
      <h2 className="section-title">Today&apos;s Summary</h2>
      <div className="content-panel">
        <p className="content-section__body">{aiSummary}</p>
      </div>
    </section>
  )
}
