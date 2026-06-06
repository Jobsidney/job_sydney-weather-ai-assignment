import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getUsage } from '@/services/usage.service'

export function useUsageQuery() {
  return useQuery({
    queryKey: queryKeys.usage(),
    queryFn: getUsage,
    staleTime: 10 * 60 * 1000,
  })
}
