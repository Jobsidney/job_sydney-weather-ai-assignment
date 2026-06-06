import { CurrentConditions } from '@/components/weather/CurrentConditions'
import { TodayOutlook } from '@/components/weather/TodayOutlook'
import type { WeatherResponse, WeatherUnits } from '@/types/weather.schema'

type HeroSectionProps = {
  data?: WeatherResponse
  locationName: string
  units: WeatherUnits
  isLoading: boolean
}

export function HeroSection({
  data,
  locationName,
  units,
  isLoading,
}: HeroSectionProps) {
  return (
    <section className="hero">
      <CurrentConditions
        data={data}
        locationName={locationName}
        units={units}
        isLoading={isLoading}
      />
      <TodayOutlook
        data={data}
        locationName={locationName}
        isLoading={isLoading}
      />
    </section>
  )
}
