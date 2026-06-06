import { conditionLabel } from '@/lib/conditions'
import type { WeatherResponse, WeatherUnits } from '@/types/weather.schema'

export type BasicInsights = {
  summary: string
  risks: string[]
  recommendations: string[]
}

function maxPrecipProbability(data: WeatherResponse): number {
  return data.hourly.reduce(
    (max, hour) => Math.max(max, hour.precipitation_probability ?? 0),
    0,
  )
}

function isRainCode(code: string): boolean {
  const value = Number.parseInt(code, 10)
  return (
    (value >= 51 && value <= 67) ||
    (value >= 80 && value <= 82) ||
    value >= 95
  )
}

export function buildBasicInsights(
  data: WeatherResponse,
  units: WeatherUnits,
): BasicInsights {
  const { current, daily } = data
  const today = daily[0]
  const unit = units === 'imperial' ? '°F' : '°C'
  const speedUnit = units === 'imperial' ? 'mph' : 'km/h'
  const temp = Math.round(current.temperature)
  const feelsLike = Math.round(current.feels_like ?? current.temperature)
  const condition = conditionLabel(current.condition_code).toLowerCase()
  const high = today ? Math.round(today.temp_max) : null
  const low = today ? Math.round(today.temp_min) : null
  const range =
    high != null && low != null ? ` High ${high}${unit} and low ${low}${unit}.` : ''

  const summary = `Conditions are ${condition} at ${temp}${unit}${
    feelsLike !== temp ? `, feeling like ${feelsLike}${unit}` : ''
  }.${range}`.trim()

  const risks: string[] = []
  const recommendations: string[] = []

  const humidity = current.humidity
  if (humidity != null && humidity >= 80) {
    risks.push(`Humidity is ${Math.round(humidity)}%, which can make it feel colder than the thermometer reads.`)
  }

  const wind = current.wind_speed
  if (wind != null && wind >= (units === 'imperial' ? 12 : 20)) {
    risks.push(`Winds around ${Math.round(wind)} ${speedUnit} may feel brisk outdoors.`)
  }

  const precip = maxPrecipProbability(data)
  if (precip >= 40) {
    risks.push(`Rain chances climb to ${Math.round(precip)}% later today.`)
    recommendations.push('Keep a light jacket or umbrella handy if you head out.')
  }

  if (isRainCode(current.condition_code) || (today && isRainCode(today.condition_code))) {
    recommendations.push('Wet conditions are possible — choose waterproof footwear.')
  }

  const uv = current.uv_index
  if (uv != null && uv >= 6) {
    risks.push(`UV index reaches ${Math.round(uv)} — sun exposure adds up quickly.`)
    recommendations.push('Use sunscreen and seek shade during the warmest hours.')
  }

  if (temp <= (units === 'imperial' ? 50 : 12)) {
    recommendations.push('Layer up for the cooler temperatures, especially in the morning.')
  } else if (temp >= (units === 'imperial' ? 82 : 28)) {
    recommendations.push('Stay hydrated and plan outdoor activity for earlier or later in the day.')
  }

  if (recommendations.length === 0) {
    recommendations.push('A good day to check the hourly forecast before making outdoor plans.')
  }

  if (risks.length === 0) {
    risks.push('No major weather hazards stand out in the current forecast window.')
  }

  return { summary, risks, recommendations }
}
