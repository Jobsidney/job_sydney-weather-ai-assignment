import { ipLookupResponseSchema } from '@/types/location.schema'
import {
  weatherResponseSchema,
  weatherGeoResponseSchema,
  insightsResponseSchema,
} from '@/types/weather.schema'
import { usageResponseSchema } from '@/types/usage.schema'
import { getMockDelay } from '@/config/dev'
import mockWeatherData from '@/data/mock-weather.json'
import mockUsageData from '@/data/mock-usage.json'
import mockInsightsData from '@/data/mock-insights.json'
import mockLocations from '@/data/mock-locations.json'
import mockScenarios from '@/data/mock-scenarios.json'

// Simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get location-specific data or create realistic variations
function getLocationData(lat: number, lon: number) {
  // Check if we have specific data for known cities
  const knownCities = mockLocations as any
  
  // Find closest match or use Sydney as default
  let locationKey = 'sydney'
  let minDistance = Infinity
  
  for (const [key, city] of Object.entries(knownCities)) {
    const cityData = city as any
    const distance = Math.abs(lat - cityData.location.lat) + Math.abs(lon - cityData.location.lon)
    if (distance < minDistance) {
      minDistance = distance
      locationKey = key
    }
  }
  
  return knownCities[locationKey]
}

// Generate realistic weather scenario
function generateWeatherScenario(baseTemp: number) {
  const scenarios = mockScenarios as any
  
  // Choose scenario based on temperature and randomness
  let chosenScenario = 'partly_cloudy'
  
  if (baseTemp > 25) {
    chosenScenario = Math.random() > 0.7 ? 'clear_day' : 'partly_cloudy'
  } else if (baseTemp < 10) {
    chosenScenario = Math.random() > 0.6 ? 'cloudy' : 'light_rain'
  } else if (baseTemp < 5) {
    chosenScenario = Math.random() > 0.4 ? 'heavy_rain' : 'cloudy'
  }
  
  return scenarios[chosenScenario]
}

// Mock weather data with location variations
export async function getMockWeather(lat: number, lon: number) {
  console.log(`🎭 Using MOCK weather data for lat: ${lat}, lon: ${lon} - NO API CALL MADE`)
  await delay(getMockDelay('weather'))
  
  // Get base data for this location
  const locationData = getLocationData(lat, lon)
  const baseData = { ...mockWeatherData }
  
  // Use location-specific current weather if available
  if (locationData.current) {
    baseData.current = { ...locationData.current }
    baseData.ai_summary = locationData.ai_summary
  }
  
  // Generate scenario-based variations for forecast
  const scenario = generateWeatherScenario(baseData.current.temperature)
  
  // Update location
  baseData.location.lat = lat
  baseData.location.lon = lon
  baseData.location.timezone = locationData.location.timezone
  
  // Generate varied daily forecast
  baseData.daily = baseData.daily.map((day) => {
    const tempVariation = Math.random() * 6 - 3 // ±3°C variation
    const conditionVariation = Math.random() > 0.7 ? scenario.condition_code : day.condition_code
    
    return {
      ...day,
      temp_min: Math.round(Math.max(0, day.temp_min + tempVariation)),
      temp_max: Math.round(day.temp_max + tempVariation + 2),
      condition_code: conditionVariation,
      icon: Math.random() > 0.8 ? scenario.icon : day.icon,
      precipitation_probability: Math.round(Math.random() * 60)
    }
  })
  
  // Generate varied hourly forecast
  baseData.hourly = baseData.hourly.map((hour) => {
    const tempVariation = Math.random() * 4 - 2 // ±2°C variation
    return {
      ...hour,
      temperature: Math.round(hour.temperature + tempVariation),
      condition_code: Math.random() > 0.8 ? scenario.condition_code : hour.condition_code,
      precipitation_probability: Math.round(Math.random() * 40)
    }
  })
  
  return weatherResponseSchema.parse(baseData)
}

export async function getMockIpLookup(ip: string) {
  console.log(`🎭 Using MOCK ip-lookup for ip: ${ip} - NO API CALL MADE`)
  await delay(getMockDelay('weather'))

  const locationData = getLocationData(-33.8688, 151.2093)

  return ipLookupResponseSchema.parse({
    ip: ip === 'auto' ? '127.0.0.1' : ip,
    ip_hash: 'mock-ip-hash',
    geo: {
      lat: locationData.location.lat,
      lon: locationData.location.lon,
      city: 'Sydney',
      region: 'New South Wales',
      country: 'AU',
      timezone: locationData.location.timezone,
    },
  })
}

export async function getMockWeatherGeo() {
  console.log('🎭 Using MOCK weather-geo data - NO API CALL MADE')
  await delay(getMockDelay('weather'))

  const baseData = { ...mockWeatherData }

  return weatherGeoResponseSchema.parse({
    ...baseData,
    location: { ...baseData.location, country: 'AU' },
    ip_geo: {
      country: 'AU',
      lat: baseData.location.lat,
      lon: baseData.location.lon,
      source: 'mock',
    },
  })
}

export async function getMockInsights(lat: number, lon: number) {
  console.log(`🎭 Using MOCK insights data for lat: ${lat}, lon: ${lon} - NO API CALL MADE`)
  await delay(getMockDelay('insights'))
  
  const baseData = { ...mockInsightsData }
  baseData.location.lat = lat
  baseData.location.lon = lon
  
  return insightsResponseSchema.parse(baseData)
}

export async function getMockForecast14(lat: number, lon: number) {
  console.log(`🎭 Using MOCK 14-day forecast data for lat: ${lat}, lon: ${lon} - NO API CALL MADE`)
  await delay(getMockDelay('forecast14'))
  
  // For 14-day forecast, we'll extend the daily array
  const baseData = { ...mockWeatherData }
  
  // Create additional days (days 15-28)
  const additionalDays = []
  for (let i = 14; i < 28; i++) {
    const date = new Date('2026-06-06')
    date.setDate(date.getDate() + i)
    
    additionalDays.push({
      date: date.toISOString().split('T')[0],
      temp_min: 8 + Math.round(Math.random() * 6),
      temp_max: 18 + Math.round(Math.random() * 8),
      condition_code: ['0', '1', '2', '3'][Math.floor(Math.random() * 4)],
      icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
      precipitation_probability: Math.round(Math.random() * 40),
      sunrise: "06:54",
      sunset: "17:08"
    })
  }
  
  baseData.daily = [...baseData.daily, ...additionalDays]
  baseData.location.lat = lat
  baseData.location.lon = lon
  
  return weatherResponseSchema.parse(baseData)
}

export async function getMockUsage() {
  console.log(`🎭 Using MOCK usage data - NO API CALL MADE`)
  await delay(getMockDelay('usage'))
  
  // Add some randomness to usage numbers
  const data = { ...mockUsageData }
  data.period.requestCount = 88 + Math.floor(Math.random() * 20)
  data.remaining.requests = data.limits.requests - data.period.requestCount
  
  return usageResponseSchema.parse(data)
}