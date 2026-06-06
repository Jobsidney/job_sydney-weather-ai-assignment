export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export class FeatureNotAvailableError extends ApiError {
  readonly upgradeUrl: string
  readonly plan: string

  constructor(message: string, plan: string, upgradeUrl: string) {
    super(403, message, { plan, upgrade: upgradeUrl })
    this.name = 'FeatureNotAvailableError'
    this.plan = plan
    this.upgradeUrl = upgradeUrl
  }
}

export function isFeatureNotAvailableError(
  error: unknown,
): error is FeatureNotAvailableError {
  return error instanceof FeatureNotAvailableError
}
