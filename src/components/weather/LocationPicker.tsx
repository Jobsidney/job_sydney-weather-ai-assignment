import { useEffect, useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Navigation, Search, X } from 'lucide-react'
import { FeatureNotAvailableError } from '@/api/errors'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import { Skeleton } from '@/components/ui/skeleton'
import { geoResponseToCityPreset, ipLookupToCityPreset, isIpAddress } from '@/lib/geo-location'
import { countryLabel } from '@/lib/countries'
import { getIpLookup, getWeatherByGeo } from '@/services/weather.service'
import { locationResultToPreset, searchLocations } from '@/services/location.service'
import { CITY_PRESETS } from '@/lib/constants'
import type { CityPreset } from '@/lib/constants'
import type { WeatherUnits } from '@/types/weather.schema'

type LocationPickerProps = {
  currentLocation: CityPreset
  units: WeatherUnits
  onLocationChange: (location: CityPreset) => void
  onClose: () => void
}

export function LocationPicker({
  currentLocation,
  units,
  onLocationChange,
  onClose,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [ipLookupBlocked, setIpLookupBlocked] = useState<FeatureNotAvailableError | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  const filteredPresets = CITY_PRESETS.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const citySearchQuery = useQuery({
    queryKey: ['location-search', debouncedQuery],
    queryFn: () => searchLocations(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && !isIpAddress(debouncedQuery),
    staleTime: 5 * 60 * 1000,
  })

  const apiResults = citySearchQuery.data ?? []
  const showApiResults = debouncedQuery.length >= 2 && !isIpAddress(debouncedQuery)

  const handleUseCurrentLocation = async () => {
    setIsSearching(true)
    setGeoError(null)
    setIpLookupBlocked(null)
    try {
      const data = await getWeatherByGeo({ ip: 'auto', units, days: 1, ai: false })
      onLocationChange(geoResponseToCityPreset(data))
      onClose()
    } catch {
      setGeoError('Location detection failed. Try searching for a city instead.')
    } finally {
      setIsSearching(false)
    }
  }

  const selectPreset = (city: CityPreset) => {
    onLocationChange(city)
    onClose()
  }

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    setIsSearching(true)
    setGeoError(null)
    setIpLookupBlocked(null)

    try {
      if (isIpAddress(query)) {
        const data = await getIpLookup(query === 'auto' ? 'auto' : query)
        onLocationChange(ipLookupToCityPreset(data))
        onClose()
        return
      }

      const exactPreset = CITY_PRESETS.find(
        (city) => city.name.toLowerCase() === query.toLowerCase(),
      )
      if (exactPreset) {
        selectPreset(exactPreset)
        return
      }

      const results = await searchLocations(query)
      if (results.length > 0) {
        onLocationChange(locationResultToPreset(results[0]))
        onClose()
        return
      }

      if (filteredPresets.length === 1) {
        selectPreset(filteredPresets[0])
        return
      }

      setGeoError('No matching city found. Try a different spelling.')
    } catch (error) {
      if (error instanceof FeatureNotAvailableError) {
        setIpLookupBlocked(error)
        return
      }
      setGeoError('Search failed. Try again or pick a city from the list.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="location-picker-overlay">
      <div className="location-picker">
        <div className="location-picker__header">
          <h3 className="location-picker__title">Search City or IP</h3>
          <button
            type="button"
            className="location-picker__close"
            onClick={onClose}
            aria-label="Close location search"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form className="location-picker__search" onSubmit={handleSearchSubmit}>
          <Search size={16} strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Search city or IP address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setGeoError(null)
            }}
            className="location-picker__input"
            autoFocus
          />
        </form>

        <button
          type="button"
          className="location-picker__current"
          onClick={handleUseCurrentLocation}
          disabled={isSearching}
        >
          <Navigation size={16} strokeWidth={1.5} />
          <span>{isSearching ? 'Searching...' : 'Use my location (IP)'}</span>
        </button>

        {geoError && <p className="location-picker__error">{geoError}</p>}

        {ipLookupBlocked && (
          <div className="location-picker__upgrade">
            <UpgradePrompt
              title="IP lookup requires Pro"
              description="Upgrade to search locations by IP address, or search by city name instead."
              upgradeUrl={ipLookupBlocked.upgradeUrl}
              plan={ipLookupBlocked.plan}
            />
          </div>
        )}

        <div className="location-picker__cities">
          {showApiResults && citySearchQuery.isLoading && (
            <>
              <Skeleton className="h-12 w-full mx-5 mb-2" />
              <Skeleton className="h-12 w-full mx-5 mb-2" />
            </>
          )}

          {showApiResults &&
            !citySearchQuery.isLoading &&
            apiResults.map((result) => {
              const preset = locationResultToPreset(result)
              const isActive =
                currentLocation.lat === preset.lat && currentLocation.lon === preset.lon

              return (
                <button
                  key={result.id}
                  type="button"
                  className={`location-picker__city ${isActive ? 'location-picker__city--active' : ''}`}
                  onClick={() => selectPreset(preset)}
                >
                  <MapPin size={14} strokeWidth={1.5} />
                  <div className="location-picker__city-info">
                    <span className="location-picker__city-name">{result.name}</span>
                    <span className="location-picker__city-country">
                      {[result.admin1, countryLabel(result.country_code) ?? result.country_code]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </button>
              )
            })}

          {showApiResults &&
            !citySearchQuery.isLoading &&
            apiResults.length === 0 && (
              <p className="location-picker__empty">No cities found for &ldquo;{debouncedQuery}&rdquo;</p>
            )}

          {!showApiResults &&
            filteredPresets.map((city) => (
              <button
                key={`${city.lat}-${city.lon}`}
                type="button"
                className={`location-picker__city ${
                  currentLocation.lat === city.lat && currentLocation.lon === city.lon
                    ? 'location-picker__city--active'
                    : ''
                }`}
                onClick={() => selectPreset(city)}
              >
                <MapPin size={14} strokeWidth={1.5} />
                <div className="location-picker__city-info">
                  <span className="location-picker__city-name">{city.name}</span>
                  <span className="location-picker__city-country">{city.country}</span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
