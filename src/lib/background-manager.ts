import cloudyDay from '@/assets/cloudy-day.jpg'
import thunderCloudyNight from '@/assets/thunder-cloudy-night.jpg'
import { conditionLabel } from './conditions'

export type WeatherBackground = {
  light: string
  dark: string
  overlay: {
    light: string
    dark: string
  }
}

const WEATHER_BACKGROUNDS: Record<string, WeatherBackground> = {
  clear: {
    light: cloudyDay,
    dark: thunderCloudyNight,
    overlay: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(248, 250, 252, 0.80) 100%)',
      dark: 'linear-gradient(135deg, rgba(15, 23, 42, 0.80) 0%, rgba(30, 41, 59, 0.82) 100%)'
    }
  },
  cloudy: {
    light: cloudyDay,
    dark: thunderCloudyNight,
    overlay: {
      light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.80) 0%, rgba(248, 250, 252, 0.85) 100%)',
      dark: 'linear-gradient(135deg, rgba(15, 23, 42, 0.82) 0%, rgba(30, 41, 59, 0.85) 100%)'
    }
  },
  rainy: {
    light: cloudyDay,
    dark: thunderCloudyNight,
    overlay: {
      light: 'linear-gradient(135deg, rgba(71, 85, 105, 0.10) 0%, rgba(148, 163, 184, 0.20) 100%)',
      dark: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.87) 100%)'
    }
  },
  stormy: {
    light: thunderCloudyNight,
    dark: thunderCloudyNight,
    overlay: {
      light: 'linear-gradient(135deg, rgba(71, 85, 105, 0.30) 0%, rgba(148, 163, 184, 0.40) 100%)',
      dark: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.88) 100%)'
    }
  }
}

export function getWeatherBackground(conditionCode: string): WeatherBackground {
  // Map condition codes to background types
  const code = conditionCode.toString()
  
  if (['95', '96', '99'].includes(code)) {
    return WEATHER_BACKGROUNDS.stormy
  }
  
  if (['51', '53', '55', '61', '63', '65', '80', '81', '82'].includes(code)) {
    return WEATHER_BACKGROUNDS.rainy
  }
  
  if (['2', '3', '45', '48'].includes(code)) {
    return WEATHER_BACKGROUNDS.cloudy
  }
  
  // Default to clear for codes '0', '1' and others
  return WEATHER_BACKGROUNDS.clear
}

export function applyWeatherBackground(conditionCode: string, isDark: boolean = false) {
  const background = getWeatherBackground(conditionCode)
  const theme = isDark ? 'dark' : 'light'
  
  const pageElement = document.querySelector('.weather-page') as HTMLElement
  if (pageElement) {
    pageElement.style.background = `
      ${background.overlay[theme]},
      url('${background[theme]}') center center / cover no-repeat
    `
    pageElement.style.backgroundAttachment = 'fixed'
  }
}

// Get readable weather type for display
export function getWeatherType(conditionCode: string): string {
  const label = conditionLabel(conditionCode).toLowerCase()
  
  if (label.includes('thunderstorm') || label.includes('storm')) {
    return 'stormy'
  }
  if (label.includes('rain') || label.includes('drizzle') || label.includes('shower')) {
    return 'rainy'  
  }
  if (label.includes('cloudy') || label.includes('overcast') || label.includes('fog')) {
    return 'cloudy'
  }
  return 'clear'
}