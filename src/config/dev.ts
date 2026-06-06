// Development configuration
export const DEV_CONFIG = {
  // Set VITE_USE_MOCK=true in .env to use mock data instead of API calls
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK === 'true',

  ENABLE_API_CALLS: {
    weather: true,
    insights: true,
    forecast14: true,
    usage: true,
  },
  
  // Mock data delays (to simulate API response times)
  MOCK_DELAYS: {
    weather: 500,        // 500ms delay
    insights: 800,       // 800ms delay  
    forecast14: 600,     // 600ms delay
    usage: 200,          // 200ms delay
  }
}

// Helper to check if we should use mock data
export function shouldUseMockData(apiType: keyof typeof DEV_CONFIG.ENABLE_API_CALLS): boolean {
  return DEV_CONFIG.USE_MOCK_DATA || !DEV_CONFIG.ENABLE_API_CALLS[apiType]
}

// Helper to get mock delay
export function getMockDelay(apiType: keyof typeof DEV_CONFIG.MOCK_DELAYS): number {
  return DEV_CONFIG.MOCK_DELAYS[apiType] || 0
}