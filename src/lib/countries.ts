const COUNTRY_LABELS: Record<string, string> = {
  AU: 'Australia',
  KE: 'Kenya',
  NL: 'Netherlands',
  US: 'United States',
  GB: 'United Kingdom',
}

export function countryLabel(code?: string): string | undefined {
  if (!code) return undefined
  return COUNTRY_LABELS[code] ?? code
}
