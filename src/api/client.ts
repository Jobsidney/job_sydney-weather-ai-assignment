import { ApiError, FeatureNotAvailableError } from '@/api/errors'
import { proErrorSchema } from '@/types/api.schema'

const API_BASE = '/api'

type RequestOptions = {
  params?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.pathname + url.search
}

export async function apiGet<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, options.params))

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)

    if (response.status === 403) {
      const parsed = proErrorSchema.safeParse(body)
      if (parsed.success) {
        throw new FeatureNotAvailableError(
          parsed.data.error,
          parsed.data.plan,
          parsed.data.upgrade,
        )
      }
    }

    const message =
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
        ? body.error
        : `Request failed with status ${response.status}`

    throw new ApiError(response.status, message, body)
  }

  return response.json() as Promise<T>
}
