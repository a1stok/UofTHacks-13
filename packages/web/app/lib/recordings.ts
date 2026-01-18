/**
 * Recordings Library
 * 
 * Fetches session recordings from the test-website API
 */

export interface RecordingMetadata {
  filename: string
  sessionId: string
  amplitudeSessionId?: number
  amplitudeDeviceId?: string
  amplitudeUserId?: string | null
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

const API_PATH = '/api/recordings'

// Get the correct port based on version
function getPortForVersion(version?: string): number {
  // Version A -> Port 3001, Version B -> Port 3002
  return version === 'B' ? 3002 : 3001
}

// Check if a port is available
async function checkPort(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}${API_PATH}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000)
    })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchRecordingsList(version?: string): Promise<RecordingMetadata[]> {
  try {
    const port = getPortForVersion(version)
    
    // Check if the specific port is available
    const isAvailable = await checkPort(port)
    if (!isAvailable) {
      console.warn(`[Recordings] Port ${port} not available for version ${version || 'A'}`)
      return []
    }

    const url = new URL(`http://localhost:${port}${API_PATH}`)
    if (version) {
      url.searchParams.set('version', version)
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    
    const data = await response.json()
    const recordings: RecordingMetadata[] = data.recordings || []

    // API now returns each snapshot as separate recording, so no deduplication needed
    // Sort by startTime ascending (chronological order) so first snapshot shows as 0:00
    recordings.sort((a, b) => a.startTime - b.startTime)

    console.log(`[Recordings] Version ${version || 'A'} from port ${port}: ${recordings.length} recordings`)
    return recordings
  } catch (error) {
    console.error(`[Recordings] Error fetching version ${version}:`, error)
    return []
  }
}

export async function fetchRecording(sessionId: string): Promise<Recording | null> {
  try {
    // Try both ports for individual recording fetch (since we might not know the version)
    const ports = [3001, 3002]
    
    for (const port of ports) {
      try {
        const url = new URL(`http://localhost:${port}${API_PATH}`)
    url.searchParams.set('sessionId', sessionId)
    
    const response = await fetch(url.toString())
        if (response.ok) {
    return await response.json()
        }
      } catch {
        continue
      }
    }
    
    return null
  } catch (error) {
    console.error('[Recordings] Error fetching recording:', error)
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
