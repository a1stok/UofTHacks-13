import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAmplitudeService, isAmplitudeConnected } from '@/lib/amplitude'
import type { 
  AmplitudeEvent, 
  AmplitudeSessionReplay, 
  AmplitudeHeatmapData, 
  AmplitudeMetrics 
} from '@/types/experiment'

export const AMPLITUDE_QUERY_KEYS = {
  EVENTS: 'amplitude:events',
  METRICS: 'amplitude:metrics', 
  HEATMAPS: 'amplitude:heatmaps',
  SESSIONS: 'amplitude:sessions',
  COHORTS: 'amplitude:cohorts',
  USER_ACTIVITY: 'amplitude:user_activity'
} as const

export const useAmplitudeMetrics = (params?: any) => {
  return useQuery({
    queryKey: [AMPLITUDE_QUERY_KEYS.METRICS, params],
    queryFn: async (): Promise<AmplitudeMetrics> => {
      if (!isAmplitudeConnected()) {
        throw new Error('Amplitude not connected')
      }
      const service = getAmplitudeService()
      return await service.getMetrics(params)
    },
    enabled: isAmplitudeConnected(),
    staleTime: 5 * 60 * 1000,
    retry: 3
  })
}

export const useAmplitudeEvents = (params?: any) => {
  return useQuery({
    queryKey: [AMPLITUDE_QUERY_KEYS.EVENTS, params], 
    queryFn: async (): Promise<AmplitudeEvent[]> => {
      if (!isAmplitudeConnected()) {
        throw new Error('Amplitude not connected')
      }
      const service = getAmplitudeService()
      return await service.getEvents(params)
    },
    enabled: isAmplitudeConnected(),
    staleTime: 2 * 60 * 1000,
    retry: 3
  })
}

export const useAmplitudeHeatmaps = (pageUrl?: string) => {
  return useQuery({
    queryKey: [AMPLITUDE_QUERY_KEYS.HEATMAPS, pageUrl],
    queryFn: async (): Promise<AmplitudeHeatmapData[]> => {
      if (!isAmplitudeConnected()) {
        throw new Error('Amplitude not connected')
      }
      const service = getAmplitudeService()
      return await service.getHeatmapData({ page_url: pageUrl })
    },
    enabled: isAmplitudeConnected() && !!pageUrl,
    staleTime: 10 * 60 * 1000,
    retry: 2
  })
}

export const useAmplitudeSessionReplays = (params?: any) => {
  return useQuery({
    queryKey: [AMPLITUDE_QUERY_KEYS.SESSIONS, params],
    queryFn: async (): Promise<AmplitudeSessionReplay[]> => {
      if (!isAmplitudeConnected()) {
        throw new Error('Amplitude not connected')
      }
      const service = getAmplitudeService()
      return await service.getSessionReplays(params)
    },
    enabled: isAmplitudeConnected(),
    staleTime: 15 * 60 * 1000,
    retry: 2
  })
}

export const useAmplitudeCohorts = (params?: any) => {
  return useQuery({
    queryKey: [AMPLITUDE_QUERY_KEYS.COHORTS, params],
    queryFn: async (): Promise<any> => {
      if (!isAmplitudeConnected()) {
        throw new Error('Amplitude not connected')
      }
      const service = getAmplitudeService()
      return await service.getCohorts(params)
    },
    enabled: isAmplitudeConnected(),
    staleTime: 30 * 60 * 1000,
    retry: 2
  })
}

export const useAmplitudeConnection = () => {
  const queryClient = useQueryClient()
  
  return {
    isConnected: isAmplitudeConnected(),
    invalidateAll: () => {
      Object.values(AMPLITUDE_QUERY_KEYS).forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  }
}