/**
 * Recordings Hooks
 * 
 * React Query hooks for fetching session recordings
 * These run client-side only since they fetch from localhost
 */

import { useQuery } from '@tanstack/react-query'
import { fetchRecordingsList, fetchRecording } from '~/lib/recordings'
import type { RecordingMetadata, Recording } from '~/lib/recordings'

export const RECORDINGS_QUERY_KEYS = {
  LIST: 'recordings:list',
  DETAIL: 'recordings:detail',
} as const

// Check if we're on the client
const isClient = typeof window !== 'undefined'

export function useRecordingsList(version?: string) {
  return useQuery({
    queryKey: [RECORDINGS_QUERY_KEYS.LIST, version],
    queryFn: () => fetchRecordingsList(version),
    staleTime: 10 * 1000, // Refresh every 10 seconds
    refetchInterval: isClient ? 10 * 1000 : false, // Auto-refresh only on client
    enabled: isClient, // Only run on client side
  })
}

export function useRecording(sessionId: string | null) {
  return useQuery({
    queryKey: [RECORDINGS_QUERY_KEYS.DETAIL, sessionId],
    queryFn: () => fetchRecording(sessionId!),
    enabled: isClient && !!sessionId, // Only run on client side when sessionId exists
    staleTime: 60 * 1000, // 1 minute
  })
}

export type { RecordingMetadata, Recording }
