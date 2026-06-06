import { useState } from 'react'
import {
  ChevronDown,
  Cloud,
  Globe,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  CloudRain,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getWeatherType } from '@/lib/background-manager'

type NavLink = {
  label: string
  id: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Today', id: 'today' },
  { label: 'Hourly', id: 'hourly' },
  { label: '7-Day', id: '7day' },
  { label: 'Insights', id: 'insights' },
  { label: 'Pro', id: 'pro' },
]

type WeatherNavProps = {
  activeTab: string
  onTabChange: (id: string) => void
  locationName: string
  countryCode: string
  units: 'metric' | 'imperial'
  onUnitsToggle: () => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  onLocationClick?: () => void
  onSearchClick?: () => void
  onGeoLocationClick?: () => void
  isDetectingLocation?: boolean
  currentCondition?: string
}

export function WeatherNav({
  activeTab,
  onTabChange,
  locationName,
  countryCode,
  units,
  onUnitsToggle,
  theme,
  onThemeToggle,
  onLocationClick,
  onSearchClick,
  onGeoLocationClick,
  isDetectingLocation = false,
  currentCondition,
}: WeatherNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const getWeatherIcon = () => {
    if (!currentCondition) return <Cloud strokeWidth={1.5} />
    const weatherType = getWeatherType(currentCondition)
    
    switch (weatherType) {
      case 'stormy':
        return <Zap strokeWidth={1.5} />
      case 'rainy':
        return <CloudRain strokeWidth={1.5} />
      case 'cloudy':
        return <Cloud strokeWidth={1.5} />
      case 'clear':
        return theme === 'dark' ? <Moon strokeWidth={1.5} /> : <Sun strokeWidth={1.5} />
      default:
        return <Cloud strokeWidth={1.5} />
    }
  }

  return (
    <nav className="wnav">
      <div className="wnav__bar">
        <div className="wnav__left">
          <div className="wnav__brand">
            <div className="wnav__logo-icon">
              {getWeatherIcon()}
            </div>
            <span className="wnav__logo-text">
              Weather<span className="wnav__logo-accent">AI</span>
            </span>
          </div>

          <ul className="wnav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className={cn(
                    'wnav__link',
                    activeTab === link.id && 'wnav__link--active',
                  )}
                  onClick={() => onTabChange(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="wnav__right">
          <button type="button" className="wnav__text-action" onClick={onThemeToggle}>
            {theme === 'dark' ? <Sun strokeWidth={1.75} /> : <Moon strokeWidth={1.75} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button type="button" className="wnav__text-action">
            <span>More Forecasts</span>
            <ChevronDown strokeWidth={1.75} className="wnav__text-action-caret" />
          </button>
          <button
            type="button"
            className="wnav__icon-btn"
            aria-label="Search city or IP"
            onClick={onSearchClick}
          >
            <Search strokeWidth={2} />
          </button>
          <button
            type="button"
            className="wnav__icon-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X strokeWidth={2} /> : <Menu strokeWidth={2} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <ul className="wnav__mobile-links">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                className={cn(
                  'wnav__mobile-link',
                  activeTab === link.id && 'wnav__mobile-link--active',
                )}
                onClick={() => {
                  onTabChange(link.id)
                  setMobileOpen(false)
                }}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="wnav__sub">
        <div className="wnav__location">
          <button 
            type="button" 
            className="wnav__location-name wnav__text-link"
            onClick={onLocationClick}
          >
            {locationName}
          </button>
          <span className="wnav__location-sep">–</span>
          <span className="wnav__location-hint">
            Based on your internet address
          </span>
          <span className="wnav__location-sep">–</span>
          <button
            type="button"
            className="wnav__text-link"
            onClick={onGeoLocationClick}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? 'Detecting…' : 'Use precise location'}
          </button>
          <span className="wnav__location-sep">–</span>
          <button type="button" className="wnav__text-link">
            More information
          </button>
        </div>

        <button
          type="button"
          className="wnav__units-btn"
          onClick={onUnitsToggle}
        >
          <Globe strokeWidth={1.5} className="wnav__units-globe" />
          <span>{countryCode} | {units === 'metric' ? '°C' : '°F'}</span>
          <span className="wnav__units-caret">▾</span>
        </button>
      </div>
    </nav>
  )
}
