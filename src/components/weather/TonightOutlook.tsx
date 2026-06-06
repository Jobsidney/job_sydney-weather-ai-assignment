import { Droplets, Wind } from 'lucide-react'
import { conditionLabel } from '@/lib/conditions'
import { buildTonightOutlook } from '@/lib/tonight-outlook'
import { WeatherConditionIcon } from '@/components/weather/WeatherConditionIcon'
import {
  formatSunTime,
  formatTemperatureValue,
  formatWindSpeed,
} from '@/lib/formatters'
import type { DailyForecast, HourlyForecast, WeatherUnits } from '@/types/weather.schema'

type TonightOutlookProps = {
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  units: WeatherUnits
}

export function TonightOutlook({ hourly, daily, units }: TonightOutlookProps) {
  const tonight = buildTonightOutlook(hourly, daily, units)
  if (!tonight) return null

  const today = daily[0]

  return (
    <div className="content-panel tonight-card">
      <div className="tonight-card__header">
        <div>
          <h3 className="tonight-card__title">{tonight.label}</h3>
          <span className="tonight-card__subtitle">Night</span>
        </div>
        <div className="tonight-card__main">
          <WeatherConditionIcon
            conditionCode={tonight.conditionCode}
            iconUrl={tonight.icon}
            periodLabel="Overnight"
            size="md"
            className="tonight-card__icon"
          />
          <span className="tonight-card__temp">
            {formatTemperatureValue(tonight.temperature)}°
          </span>
        </div>
      </div>

      <p className="tonight-card__summary">{tonight.summary}</p>

      <div className="tonight-card__stats">
        <span className="tonight-card__stat">
          <Droplets size={14} strokeWidth={1.75} aria-hidden="true" />
          {Math.round(tonight.precipProbability)}%
        </span>
        {tonight.windSpeed != null && (
          <span className="tonight-card__stat">
            <Wind size={14} strokeWidth={1.75} aria-hidden="true" />
            {formatWindSpeed(tonight.windSpeed, units)}
          </span>
        )}
      </div>

      {(today?.sunrise || today?.sunset) && (
        <div className="tonight-card__details">
          {today.sunrise && (
            <div className="tonight-card__detail">
              <span>Sunrise</span>
              <strong>{formatSunTime(today.sunrise)}</strong>
            </div>
          )}
          {today.sunset && (
            <div className="tonight-card__detail">
              <span>Sunset</span>
              <strong>{formatSunTime(today.sunset)}</strong>
            </div>
          )}
          <div className="tonight-card__detail">
            <span>Condition</span>
            <strong>{conditionLabel(tonight.conditionCode)}</strong>
          </div>
        </div>
      )}
    </div>
  )
}
