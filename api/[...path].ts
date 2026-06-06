import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fetchCitySearch } from './lib/geocode.js'

const WEATHER_AI_BASE = 'https://api.weather-ai.co'

function proxyBody(req: VercelRequest): RequestInit['body'] | undefined {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined
  }

  if (req.body == null || req.body === '') {
    return undefined
  }

  if (typeof req.body === 'string') {
    return req.body
  }

  if (Buffer.isBuffer(req.body)) {
    return req.body
  }

  return JSON.stringify(req.body)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    res.status(500).json({ error: 'API_KEY is not configured' })
    return
  }

  const pathParam = req.query.path
  const segments = Array.isArray(pathParam)
    ? pathParam
    : pathParam
      ? [pathParam]
      : []

  if (segments.length === 0) {
    res.status(400).json({ error: 'Missing API path' })
    return
  }

  const targetPath = `/${segments.join('/')}`

  if (targetPath === '/v1/search' && req.method === 'GET') {
    const q = typeof req.query.q === 'string' ? req.query.q : ''
    try {
      const data = await fetchCitySearch(q)
      res.status(200).json(data)
    } catch {
      res.status(502).json({ error: 'Failed to search locations' })
    }
    return
  }

  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry))
    } else if (value !== undefined) {
      query.append(key, value)
    }
  }

  const queryString = query.toString()
  const targetUrl = `${WEATHER_AI_BASE}${targetPath}${queryString ? `?${queryString}` : ''}`

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    }

    const forwardedFor = req.headers['x-forwarded-for']
    if (typeof forwardedFor === 'string') {
      headers['X-Forwarded-For'] = forwardedFor
    }

    const body = proxyBody(req)
    if (
      body &&
      typeof body === 'string' &&
      !headers['Content-Type'] &&
      typeof req.headers['content-type'] === 'string'
    ) {
      headers['Content-Type'] = req.headers['content-type']
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    })

    const rateLimitHeaders = [
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
    ] as const

    for (const header of rateLimitHeaders) {
      const value = response.headers.get(header)
      if (value) {
        res.setHeader(header, value)
      }
    }

    const responseBody = await response.text()
    res.status(response.status)

    const contentType = response.headers.get('content-type')
    if (contentType) {
      res.setHeader('Content-Type', contentType)
    }

    res.send(responseBody)
  } catch {
    res.status(502).json({ error: 'Failed to reach Weather-AI API' })
  }
}
