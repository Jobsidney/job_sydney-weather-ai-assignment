import { useState } from 'react'
import { Droplets, Minus, Plus } from 'lucide-react'
import { conditionLabel } from '@/lib/conditions'
import { WeatherConditionIcon } from '@/components/weather/WeatherConditionIcon'
import {
  formatDailyHighLow,
  formatDailyRowDate,
  formatSunTime,
  formatWindSpeed,
} from '@/lib/formatters'
import type { DailyForecast, WeatherUnits } from '@/types/weather.schema'

type DailyForecastListProps = {
  days: DailyForecast[]
  units: WeatherUnits
}

export function DailyForecastList({ days, units }: DailyForecastListProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  const toggleExpanded = (date: string) => {
    setExpandedDate((current) => (current === date ? null : date))
  }

  return (
    <div className="content-panel daily-list">
      {days.map((day) => {
        const isExpanded = expandedDate === day.date

        return (
          <div key={day.date} className="daily-list__item">
            <div className="daily-row">
              <span className="daily-row__date">{formatDailyRowDate(day.date)}</span>
              <span className="daily-row__temps">
                {formatDailyHighLow(day.temp_max, day.temp_min)}
              </span>
              <WeatherConditionIcon
                conditionCode={day.condition_code}
                iconUrl={day.icon}
                time={`${day.date}T12:00:00`}
                size="sm"
                className="daily-row__icon"
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
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${formatDailyRowDate(day.date)}`}
                onClick={() => toggleExpanded(day.date)}
              >
                {isExpanded ? (
                  <Minus size={18} strokeWidth={1.75} />
                ) : (
                  <Plus size={18} strokeWidth={1.75} />
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="daily-row__details">
                <div className="daily-row__detail">
                  <span>Sunrise</span>
                  <strong>{day.sunrise ? formatSunTime(day.sunrise) : '—'}</strong>
                </div>
                <div className="daily-row__detail">
                  <span>Sunset</span>
                  <strong>{day.sunset ? formatSunTime(day.sunset) : '—'}</strong>
                </div>
                <div className="daily-row__detail">
                  <span>Wind</span>
                  <strong>
                    {day.wind_max != null ? formatWindSpeed(day.wind_max, units) : '—'}
                  </strong>
                </div>
                <div className="daily-row__detail">
                  <span>Precip</span>
                  <strong>
                    {day.precipitation_sum != null
                      ? `${day.precipitation_sum.toFixed(1)} mm`
                      : day.precipitation_probability != null
                        ? `${Math.round(day.precipitation_probability)}%`
                        : '—'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
