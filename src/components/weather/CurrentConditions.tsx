import {
  ArrowUp,
  Droplets,
  Eye,
  Gauge,
  Moon,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'
import { SunArc } from '@/components/weather/SunArc'
import { Skeleton } from '@/components/ui/skeleton'
import { conditionLabel } from '@/lib/conditions'
import {
  formatHighLow,
  formatObservedAt,
  formatPercent,
  formatPressure,
  formatTemperatureValue,
  formatVisibility,
  formatWindSpeed,
} from '@/lib/formatters'
import type {
  DailyForecast,
  HourlyForecast,
  WeatherResponse,
  WeatherUnits,
} from '@/types/weather.schema'

type CurrentConditionsProps = {
  data?: WeatherResponse
  locationName: string
  units: WeatherUnits
  isLoading: boolean
}

function nearestHour(hourly: HourlyForecast[], currentTime: string) {
  return hourly.find((h) => h.time === currentTime) ?? hourly[0]
}

function todayDaily(daily: DailyForecast[]): DailyForecast | undefined {
  // For mock data, just return the first day which represents "today"
  return daily[0]
}

export function CurrentConditions({
  data,
  locationName,
  units,
  isLoading,
}: CurrentConditionsProps) {
  if (isLoading && !data) {
    return (
      <div className="hero-left">
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-40 mb-6" />
        <Skeleton className="h-20 w-32 mb-4" />
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-56 mb-8" />
        <Skeleton className="h-px w-full mb-6" />
        <Skeleton className="h-5 w-64 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="hero-left">
        <p className="hero-left__timestamp">Weather data unavailable.</p>
      </div>
    )
  }

  const { current, hourly, daily, location } = data
  const hour = nearestHour(hourly, current.time)
  const today = todayDaily(daily)
  const feelsLike = current.feels_like ?? current.temperature
  const precip = hour?.precipitation_probability ?? 0
  const humidity = current.humidity ?? hour?.humidity
  const uvIndex = current.uv_index ?? hour?.uv_index
  const pressure = current.pressure_mb
  const visibility = current.visibility_km

  type DetailItem = {
    icon: typeof ArrowUp
    label: string
    value: string
  }

  const detailRows: [DetailItem, DetailItem][] = [
    [
      {
        icon: ArrowUp,
        label: 'High / Low',
        value: formatHighLow(today?.temp_max, today?.temp_min),
      },
      {
        icon: Wind,
        label: 'Wind',
        value: formatWindSpeed(current.wind_speed, units),
      },
    ],
    [
      {
        icon: Droplets,
        label: 'Humidity',
        value: humidity != null ? formatPercent(humidity) : '--',
      },
      {
        icon: Thermometer,
        label: 'Dew Point',
        value: hour?.feels_like != null ? `${Math.round(hour.feels_like)}°` : '--',
      },
    ],
    [
      {
        icon: Gauge,
        label: 'Pressure',
        value: formatPressure(pressure),
      },
      {
        icon: Sun,
        label: 'UV Index',
        value: uvIndex != null ? `${Math.round(uvIndex)} of 10` : '--',
      },
    ],
    [
      {
        icon: Eye,
        label: 'Visibility',
        value: formatVisibility(visibility, units),
      },
      {
        icon: Moon,
        label: 'Moon Phase',
        value: '--',
      },
    ],
  ]

  return (
    <div className="hero-left">
      <div className="hero-left__header">
        <h1 className="hero-left__title">{locationName} Weather</h1>
        <p className="hero-left__timestamp">
          {formatObservedAt(current.time, location.timezone)}
        </p>
      </div>

      <div className="hero-left__main">
        <p className="hero-left__temp">
          {formatTemperatureValue(current.temperature)}°
        </p>

        <p className="hero-left__condition">
          {conditionLabel(current.condition_code)}
        </p>

        <p className="hero-left__rain">
          {Math.round(precip)}% chance of rain
        </p>
      </div>

      <div className="hero-left__weather-section">
        <h2 className="hero-left__section-title">
          Weather today in {locationName}
        </h2>

        <div className="hero-detail-top">
          <div className="hero-detail-top__feels">
            <span className="hero-detail-top__feels-temp">
              {formatTemperatureValue(feelsLike)}°
            </span>
            <span className="hero-detail-top__feels-label">Feels Like</span>
          </div>

          {today?.sunrise && today?.sunset && (
            <SunArc
              sunrise={today.sunrise}
              sunset={today.sunset}
              currentTime={current.time}
              timezone={location.timezone}
            />
          )}
        </div>

        <div className="hero-detail-table">
          {detailRows.map((row, rowIndex) => (
            <div key={rowIndex} className="hero-detail-row">
              {row.map(({ icon: Icon, label, value }) => (
                <div key={label} className="hero-detail-cell">
                  <div className="hero-detail-cell__left">
                    <Icon size={16} strokeWidth={1.75} className="hero-detail-cell__icon" />
                    <span className="hero-detail-cell__label">{label}</span>
                  </div>
                  <span className="hero-detail-cell__value">{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
