import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { WeatherConditionIcon } from '@/components/weather/WeatherConditionIcon'
import { formatTemperatureValue } from '@/lib/formatters'
import { usePopularCitiesWeather } from '@/hooks/usePopularCitiesWeather'
import type { CityPreset } from '@/lib/constants'
import type { WeatherUnits } from '@/types/weather.schema'

type PopularCitiesBarProps = {
  activeLocation: CityPreset
  units: WeatherUnits
  onSelect: (location: CityPreset) => void
}

export function PopularCitiesBar({
  activeLocation,
  units,
  onSelect,
}: PopularCitiesBarProps) {
  const { snapshots, isLoading } = usePopularCitiesWeather(units)

  if (isLoading && snapshots.length === 0) {
    return (
      <div className="popular-cities">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="popular-cities">
      {snapshots.map(({ city, temperature, conditionCode, icon }) => {
        const isActive =
          activeLocation.lat === city.lat && activeLocation.lon === city.lon

        return (
          <button
            key={city.id}
            type="button"
            className={cn('popular-city', isActive && 'popular-city--active')}
            onClick={() => onSelect(city)}
          >
            <WeatherConditionIcon
              conditionCode={conditionCode}
              iconUrl={icon}
              size="sm"
              className="popular-city__icon"
            />
            <span className="popular-city__name">{city.name}</span>
            <span className="popular-city__temp">
              {formatTemperatureValue(temperature)}°
            </span>
          </button>
        )
      })}
    </div>
  )
}
