import { useState, useEffect } from 'react'
import { WeatherNav } from '@/components/layout/WeatherNav'
import { HeroSection } from '@/components/weather/HeroSection'
import { AISummarySection } from '@/components/weather/AISummarySection'
import { ForecastSection } from '@/components/weather/ForecastSection'
import { ProInsightsSection } from '@/components/weather/ProInsightsSection'
import { Pro14DaySection } from '@/components/weather/Pro14DaySection'
import { LocationPicker } from '@/components/weather/LocationPicker'
import { LocationChips } from '@/components/weather/LocationChips'
import { UsageFooter } from '@/components/weather/UsageFooter'
import { QueryErrorAlert } from '@/components/shared/QueryErrorAlert'
import { useWeatherQuery } from '@/hooks/useWeatherQuery'
import { useLocationBootstrap } from '@/hooks/useLocationBootstrap'
import { applyWeatherBackground } from '@/lib/background-manager'
import type { WeatherUnits } from '@/types/weather.schema'

function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [units, setUnits] = useState<WeatherUnits>('metric')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })

  const {
    location,
    setLocation,
    requestGeoLocation,
    isReady,
    isDetectingLocation,
  } = useLocationBootstrap(units)

  const toggleUnits = () => setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'))

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  const locationName = `${location.name}, ${location.country}`

  const weatherQuery = useWeatherQuery(
    {
      lat: location.lat,
      lon: location.lon,
      units,
      ai: true,
    },
    { enabled: isReady },
  )

  useEffect(() => {
    if (weatherQuery.data?.current.condition_code) {
      applyWeatherBackground(weatherQuery.data.current.condition_code, theme === 'dark')
    }
  }, [weatherQuery.data?.current.condition_code, theme])

  return (
    <div className="weather-page">
      <WeatherNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locationName={locationName}
        countryCode={location.country}
        units={units}
        onUnitsToggle={toggleUnits}
        theme={theme}
        onThemeToggle={toggleTheme}
        onLocationClick={() => setShowLocationPicker(true)}
        onSearchClick={() => setShowLocationPicker(true)}
        onGeoLocationClick={() => void requestGeoLocation()}
        isDetectingLocation={isDetectingLocation}
        currentCondition={weatherQuery.data?.current.condition_code}
      />

      <main>
        {weatherQuery.error && (
          <section className="clean-section">
            <QueryErrorAlert
              message={weatherQuery.error.message}
              onRetry={() => void weatherQuery.refetch()}
            />
          </section>
        )}

        <HeroSection
          data={weatherQuery.data}
          locationName={locationName}
          units={units}
          isLoading={!isReady || weatherQuery.isLoading}
        />

        <section className="clean-section clean-section--chips">
          <LocationChips activeLocation={location} onSelect={setLocation} />
        </section>

        {activeTab === 'today' && (
          <AISummarySection
            data={weatherQuery.data}
            isLoading={!isReady || weatherQuery.isLoading}
          />
        )}

        {(activeTab === 'hourly' || activeTab === '7day') &&
          weatherQuery.data?.hourly &&
          weatherQuery.data?.daily && (
            <ForecastSection
              key={activeTab}
              hourly={weatherQuery.data.hourly}
              daily={weatherQuery.data.daily}
              units={units}
              isLoading={!isReady || weatherQuery.isLoading}
              defaultTab={activeTab === '7day' ? 'daily' : 'hourly'}
            />
          )}

        {(activeTab === 'insights' || activeTab === 'pro') && (
          <ProInsightsSection
            lat={location.lat}
            lon={location.lon}
            units={units}
          />
        )}

        {activeTab === 'pro' && (
          <Pro14DaySection
            lat={location.lat}
            lon={location.lon}
            units={units}
          />
        )}

        <UsageFooter />
      </main>

      {showLocationPicker && (
        <LocationPicker
          currentLocation={location}
          units={units}
          onLocationChange={setLocation}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

    </div>
  )
}

export default App
