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

// Helper to get from ALL active ports
async function fetchFromAllPorts(path: string, params: URLSearchParams) {
  console.log('[Recordings] Fetching from all ports:', POSSIBLE_PORTS)
  const allResults: any[] = []

  const fetches = POSSIBLE_PORTS.map(async (port) => {
    try {
      const url = new URL(`http://localhost:${port}${path}`)
      params.forEach((value, key) => url.searchParams.append(key, value))

      const response = await fetchWithTimeout(url.toString(), FETCH_TIMEOUT)
      if (response.ok) {
        const data = await response.json()
        return data.recordings || []
      }
    } catch (e) {
      // Ignore failures
    }
    return []
  })

  const results = await Promise.all(fetches)
  return results.flat()
}

export async function fetchRecordingsList(version?: string): Promise<RecordingMetadata[]> {
  try {
    const params = new URLSearchParams()
    if (version) {
      params.set('version', version)
    }

    const recordings = await fetchFromAllPorts(API_PATH, params)

    // Sort by startTime descending (most recent first)
    const sorted = recordings.sort((a: RecordingMetadata, b: RecordingMetadata) => b.startTime - a.startTime)

    // Deduplicate by sessionId AND version - keep the one with the most data
    const bestRecordings = new Map<string, RecordingMetadata>()

    // Group by unique session+version key
    sorted.forEach((rec: RecordingMetadata) => {
      const key = `${rec.sessionId}-${rec.version || 'unknown'}`
      const existing = bestRecordings.get(key)

      // If we haven't seen this session, or this file has more events/is newer, use it
      if (!existing) {
        bestRecordings.set(key, rec)
      } else {
        // Prioritize: More events > Later end time > Later start time
        const isBetter =
          (rec.eventCount > existing.eventCount) ||
          (rec.eventCount === existing.eventCount && rec.endTime > existing.endTime)

        if (isBetter) {
          bestRecordings.set(key, rec)
        }
      }
    })

    const deduplicated = Array.from(bestRecordings.values())
      .sort((a, b) => b.startTime - a.startTime)

    console.log(`[Recordings] Fetched ${recordings.length} files, deduplicated to ${deduplicated.length} unique sessions (keeping best quality)`)
    return deduplicated
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return []
  }
}

// Helper to try fetching from multiple ports and return the FIRST one that works (for single recording)
async function fetchFromAnyPort(path: string, params: URLSearchParams) {
  for (const port of POSSIBLE_PORTS) {
    try {
      const url = new URL(`http://localhost:${port}${path}`)
      params.forEach((value, key) => url.searchParams.append(key, value))
      const response = await fetchWithTimeout(url.toString(), FETCH_TIMEOUT)
      if (response.ok) {
        return await response.json()
      }
    } catch (e) {
      continue
    }
  }
  return null
}

export async function fetchRecording(sessionId: string): Promise<Recording | null> {
  try {
    const params = new URLSearchParams()
    params.set('sessionId', sessionId)

    return await fetchFromAnyPort(API_PATH, params)
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
