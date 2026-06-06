import { cn } from '@/lib/utils'
import { CITY_PRESETS, type CityPreset } from '@/lib/constants'

type LocationChipsProps = {
  activeLocation: CityPreset
  onSelect: (location: CityPreset) => void
}

export function LocationChips({ activeLocation, onSelect }: LocationChipsProps) {
  return (
    <div className="location-chips">
      {CITY_PRESETS.map((city) => {
        const isActive =
          activeLocation.lat === city.lat && activeLocation.lon === city.lon

        return (
          <button
            key={city.id}
            type="button"
            className={cn('location-chip', isActive && 'location-chip--active')}
            onClick={() => onSelect(city)}
          >
            {city.name}
          </button>
        )
      })}
    </div>
  )
}
