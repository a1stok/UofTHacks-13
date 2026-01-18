import { useState, useEffect, useCallback } from 'react'
import { fetchRecordingsList, fetchRecording } from '~/lib/recordings'
import type { RecordingMetadata, Recording } from '~/lib/recordings'

export function useRecordingsList(version?: string) {
  const [data, setData] = useState<RecordingMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const recordings = await fetchRecordingsList(version)
      setData(recordings)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [version])

  useEffect(() => {
    refetch()
    // Auto-refresh every 10 seconds
    const interval = setInterval(refetch, 10000)
    return () => clearInterval(interval)
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useRecording(sessionId: string | null) {
  const [data, setData] = useState<Recording | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setData(null)
      return
    }

    const load = async () => {
      setIsLoading(true)
      try {
        const recording = await fetchRecording(sessionId)
        setData(recording)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [sessionId])

  return { data, isLoading, error }
}
