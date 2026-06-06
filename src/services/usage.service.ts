import { apiGet } from '@/api/client'
import { shouldUseMockData } from '@/config/dev'
import { getMockUsage } from './mock.service'
import { usageResponseSchema } from '@/types/usage.schema'

export async function getUsage() {
  if (shouldUseMockData('usage')) {
    return getMockUsage()
  }
  
  const data = await apiGet<unknown>('/v1/usage')
  return usageResponseSchema.parse(data)
}
