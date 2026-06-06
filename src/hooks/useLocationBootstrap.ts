import { useEffect, useState } from 'react'
import { DEFAULT_CITY, type CityPreset } from '@/lib/constants'
import { geoResponseToCityPreset } from '@/lib/geo-location'
import {
  hasInitializedLocation,
  loadSavedLocation,
  markLocationInitialized,
  saveLocation,
} from '@/lib/location-storage'
import { useWeatherGeoQuery } from '@/hooks/useWeatherQuery'
import { getWeatherByGeo } from '@/services/weather.service'
import type { WeatherUnits } from '@/types/weather.schema'

export function useLocationBootstrap(units: WeatherUnits) {
  const saved = loadSavedLocation()
  const [location, setLocationState] = useState<CityPreset>(saved ?? DEFAULT_CITY)
  const [detectGeo, setDetectGeo] = useState(!saved && !hasInitializedLocation())

  const geoQuery = useWeatherGeoQuery(
    { units, ai: false, days: 1, ip: 'auto' },
    { enabled: detectGeo },
  )

  useEffect(() => {
    if (!detectGeo) return

    if (geoQuery.data) {
      const preset = geoResponseToCityPreset(geoQuery.data)
      setLocationState(preset)
      saveLocation(preset)
      setDetectGeo(false)
      return
    }

    if (geoQuery.isError) {
      markLocationInitialized()
      saveLocation(DEFAULT_CITY)
      setDetectGeo(false)
    }
  }, [detectGeo, geoQuery.data, geoQuery.isError])

  const setLocation = (next: CityPreset) => {
    setLocationState(next)
    saveLocation(next)
    setDetectGeo(false)
  }

  const requestGeoLocation = async () => {
    try {
      const data = await getWeatherByGeo({ ip: 'auto', units, days: 1, ai: false })
      const preset = geoResponseToCityPreset(data)
      setLocationState(preset)
      saveLocation(preset)
    } catch {
      // Keep the current location if geo detection fails.
    } finally {
      setDetectGeo(false)
    }
  }

  const isReady = !detectGeo || geoQuery.isSuccess || geoQuery.isError

  return {
    location,
    setLocation,
    requestGeoLocation,
    isReady,
    isDetectingLocation: detectGeo && geoQuery.isFetching,
  }
}
