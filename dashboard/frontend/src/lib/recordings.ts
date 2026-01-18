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

// Fetch recordings from test-website API
const RECORDINGS_API = 'http://localhost:3000/api/recordings'

export async function fetchRecordingsList(version?: string): Promise<RecordingMetadata[]> {
  try {
    const url = new URL(RECORDINGS_API)
    if (version) {
      url.searchParams.set('version', version)
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch recordings: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.recordings || []
  } catch (error) {
    console.error('Error fetching recordings:', error)
    return []
  }
}

export async function fetchRecording(sessionId: string): Promise<Recording | null> {
  try {
    const url = new URL(RECORDINGS_API)
    url.searchParams.set('sessionId', sessionId)
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Failed to fetch recording: ${response.statusText}`)
    }
    
    return await response.json()
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
