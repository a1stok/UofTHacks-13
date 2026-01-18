/**
 * Recordings Library
 * 
 * Functions for fetching and managing session recordings
 * Recordings are stored on the test-website API server
 */

export interface RecordingMetadata {
  filename: string
  sessionId: string
  version: string
  startTime: number
  endTime: number
  duration: number
  eventCount: number
  metadata: {
    url: string
    userAgent: string
    viewport: { width: number; height: number }
  }
}

export interface Recording extends RecordingMetadata {
  events: any[]
}

// List of possible ports the test-website API might be running on
// 3001 is first since Next.js often uses it when 3000 is busy
const POSSIBLE_PORTS = [3001, 3000, 3002, 3003, 3004, 3005]
const API_PATH = '/api/recordings'
const FETCH_TIMEOUT = 5000 // 5 second timeout per port

// Fetch with timeout
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Helper to try fetching from multiple ports
async function fetchWithPortFallback(path: string, params: URLSearchParams) {
  console.log('[Recordings] Attempting to fetch from ports:', POSSIBLE_PORTS)

  for (const port of POSSIBLE_PORTS) {
    try {
      const url = new URL(`http://localhost:${port}${path}`)
      params.forEach((value, key) => url.searchParams.append(key, value))

      console.log(`[Recordings] Trying port ${port}:`, url.toString())
      const response = await fetchWithTimeout(url.toString(), FETCH_TIMEOUT)

      if (response.ok) {
        const data = await response.json()
        console.log(`[Recordings] Success on port ${port}, got ${data.recordings?.length || 0} recordings`)
        return data
      } else {
        console.log(`[Recordings] Port ${port} returned ${response.status}`)
      }
    } catch (e) {
      console.log(`[Recordings] Port ${port} failed:`, e instanceof Error ? e.message : 'Unknown error')
      continue
    }
  }
  throw new Error('Failed to fetch from any known port')
}

export async function fetchRecordingsList(version?: string): Promise<RecordingMetadata[]> {
  try {
    const params = new URLSearchParams()
    if (version) {
      params.set('version', version)
    }

    const data = await fetchWithPortFallback(API_PATH, params)
    const recordings = data.recordings || []

    // Sort by startTime descending (most recent first)
    const sorted = recordings.sort((a: RecordingMetadata, b: RecordingMetadata) => b.startTime - a.startTime)

    // Deduplicate by sessionId - keep only the latest (first) occurrence of each session
    const seen = new Set<string>()
    const deduplicated = sorted.filter((rec: RecordingMetadata) => {
      if (seen.has(rec.sessionId)) {
        return false
      }
      seen.add(rec.sessionId)
      return true
    })

    console.log(`[Recordings] Fetched ${recordings.length} files, deduplicated to ${deduplicated.length} unique sessions`)
    return deduplicated
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return []
  }
}

export async function fetchRecording(sessionId: string): Promise<Recording | null> {
  try {
    const params = new URLSearchParams()
    params.set('sessionId', sessionId)

    return await fetchWithPortFallback(API_PATH, params)
  } catch (error) {
    console.error('Error fetching recording:', error)
    return null
  }
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}
