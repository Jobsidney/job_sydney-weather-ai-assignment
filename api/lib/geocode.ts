const GEOCODE_BASE = 'https://geocoding-api.open-meteo.com/v1/search'

export async function fetchCitySearch(query: string, count = 8) {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return { results: [] }
  }

  const url = new URL(GEOCODE_BASE)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', String(count))
  url.searchParams.set('language', 'en')

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`)
  }

  return response.json()
}
