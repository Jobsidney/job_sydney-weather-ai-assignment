import { apiGet } from '@/api/client'
import { usageResponseSchema } from '@/types/usage.schema'

export async function getUsage() {
  const data = await apiGet<unknown>('/v1/usage')
  return usageResponseSchema.parse(data)
}
