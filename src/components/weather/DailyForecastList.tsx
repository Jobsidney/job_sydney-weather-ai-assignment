import { Droplets, Plus } from 'lucide-react'
import { conditionLabel } from '@/lib/conditions'
import {
  formatDailyHighLow,
  formatDailyRowDate,
  weatherIconUrl,
} from '@/lib/formatters'
import type { DailyForecast } from '@/types/weather.schema'

type DailyForecastListProps = {
  days: DailyForecast[]
}

export function DailyForecastList({ days }: DailyForecastListProps) {
  return (
    <div className="content-panel daily-list">
      {days.map((day) => (
        <div key={day.date} className="daily-row">
          <span className="daily-row__date">{formatDailyRowDate(day.date)}</span>
          <span className="daily-row__temps">
            {formatDailyHighLow(day.temp_max, day.temp_min)}
          </span>
          <img
            src={weatherIconUrl(day.icon, 64)}
            alt=""
            className="daily-row__icon"
            width={32}
            height={32}
          />
          <span className="daily-row__condition">
            {conditionLabel(day.condition_code)}
          </span>
          <span className="daily-row__precip">
            <Droplets size={14} strokeWidth={1.75} aria-hidden="true" />
            {day.precipitation_probability != null
              ? `${Math.round(day.precipitation_probability)}%`
              : '—'}
          </span>
          <button
            type="button"
            className="daily-row__expand"
            aria-label={`More details for ${formatDailyRowDate(day.date)}`}
          >
            <Plus size={18} strokeWidth={1.75} />
          </button>
        </div>
      ))}
    </div>
  )
}
