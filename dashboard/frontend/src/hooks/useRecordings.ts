import { useQuery } from '@tanstack/react-query'
import { fetchRecordingsList, fetchRecording, RecordingMetadata, Recording } from '@/lib/recordings'

export const RECORDINGS_QUERY_KEYS = {
  LIST: 'recordings:list',
  DETAIL: 'recordings:detail',
} as const

export function useRecordingsList(version?: string) {
  return useQuery({
    queryKey: [RECORDINGS_QUERY_KEYS.LIST, version],
    queryFn: () => fetchRecordingsList(version),
    staleTime: 10 * 1000, // Refresh every 10 seconds
    refetchInterval: 10 * 1000, // Auto-refresh
  })
}

export function useRecording(sessionId: string | null) {
  return useQuery({
    queryKey: [RECORDINGS_QUERY_KEYS.DETAIL, sessionId],
    queryFn: () => fetchRecording(sessionId!),
    enabled: !!sessionId,
    staleTime: 60 * 1000,
  })
}
