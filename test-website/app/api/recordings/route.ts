import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Path to recordings directory - try multiple locations to handle different working directories
function getRecordingsDir(): string {
  const possiblePaths = [
    // Running from test-website folder: ../output/recordings-a
    path.join(process.cwd(), '..', 'output', 'recordings-a'),
    // Running from monorepo root via turbo: output/recordings-a  
    path.join(process.cwd(), 'output', 'recordings-a'),
    // Explicit path as fallback
    path.resolve('C:/Users/Kostiantyn/Startup/output/recordings-a'),
  ]

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      console.log('[API] Using recordings directory:', p)
      return p
    }
  }

  // Default to first path if none exist (will be created)
  console.log('[API] No existing recordings dir found, will create:', possiblePaths[0])
  return possiblePaths[0]
}

const RECORDINGS_DIR = getRecordingsDir()

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Ensure recordings directory exists
async function ensureRecordingsDir() {
  if (!existsSync(RECORDINGS_DIR)) {
    await mkdir(RECORDINGS_DIR, { recursive: true })
  }
}

// POST - Save a new recording
export async function POST(request: NextRequest) {
  try {
    await ensureRecordingsDir()

    const recording = await request.json()
    const { sessionId, version } = recording

    // Create filename with timestamp for unique saves (like before)
    // Format: A_2026-01-18T05-20-09-666Z_session_xxx.json
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${version}_${timestamp}_${sessionId}.json`
    const filepath = path.join(RECORDINGS_DIR, filename)

    // Save recording directly - each save is a snapshot
    await writeFile(filepath, JSON.stringify(recording, null, 2), 'utf-8')

    console.log(`[API] Recording saved: ${filename}`)

    return NextResponse.json({
      success: true,
      filename,
      path: filepath
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('[API] Error saving recording:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save recording' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET - List all recordings or get a specific one
export async function GET(request: NextRequest) {
  try {
    await ensureRecordingsDir()

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const version = searchParams.get('version')

    // If sessionId is provided, return the specific snapshot or original session
    if (sessionId) {
      const files = await readdir(RECORDINGS_DIR)
      
      // Check if this is a snapshot ID (contains timestamp)
      if (sessionId.includes('_2026-')) {
        // Extract original session ID and timestamp
        const parts = sessionId.split('_')
        const originalSessionId = parts.slice(0, -1).join('_') // Everything except timestamp
        const timestamp = parts[parts.length - 1] // Last part is timestamp
        
        // Find the specific snapshot file
        const snapshotFile = files.find(f => 
          f.includes(originalSessionId) && 
          f.includes(timestamp) && 
          f.endsWith('.json')
        )

        if (snapshotFile) {
          const content = await readFile(path.join(RECORDINGS_DIR, snapshotFile), 'utf-8')
          const recording = JSON.parse(content)
          
          // Add snapshot metadata
          recording.isSnapshot = true
          recording.snapshotTimestamp = timestamp
          recording.originalSessionId = originalSessionId
          
          return NextResponse.json(recording, { headers: corsHeaders })
        }
      } else {
        // Original behavior for regular session IDs - merge all snapshots
        const sessionFiles = files
          .filter(f => f.includes(sessionId) && f.endsWith('.json'))
          .sort((a, b) => a.localeCompare(b))

        if (sessionFiles.length > 0) {
          // Read all files and merge their events
          const allRecordings = await Promise.all(
            sessionFiles.map(async (filename) => {
              const content = await readFile(path.join(RECORDINGS_DIR, filename), 'utf-8')
              return JSON.parse(content)
            })
          )

          // Use the latest recording as base and merge all events
          const latestRecording = allRecordings[allRecordings.length - 1]
          const allEvents = []
          
          // Collect all events from all snapshots, avoiding duplicates by timestamp
          const seenTimestamps = new Set()
          for (const recording of allRecordings) {
            for (const event of recording.events || []) {
              if (!seenTimestamps.has(event.timestamp)) {
                allEvents.push(event)
                seenTimestamps.add(event.timestamp)
              }
            }
          }

          // Sort events by timestamp to ensure chronological order
          allEvents.sort((a, b) => a.timestamp - b.timestamp)

          // Return merged recording with all events
          const mergedRecording = {
            ...latestRecording,
            events: allEvents,
            endTime: latestRecording.endTime,
            duration: latestRecording.endTime - latestRecording.startTime,
            metadata: {
              ...latestRecording.metadata,
              snapshotCount: sessionFiles.length,
              totalEvents: allEvents.length
            }
          }

          return NextResponse.json(mergedRecording, { headers: corsHeaders })
        }
      }

      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // List all recordings - group by sessionId and return latest for each
    const files = await readdir(RECORDINGS_DIR)
    const allRecordings = await Promise.all(
      files
        .filter(f => f.endsWith('.json'))
        .filter(f => !version || f.startsWith(`${version}_`))
        .map(async (filename) => {
          try {
            const content = await readFile(path.join(RECORDINGS_DIR, filename), 'utf-8')
            const data = JSON.parse(content)
            return {
              filename,
              sessionId: data.sessionId,
              version: data.version,
              startTime: data.startTime,
              endTime: data.endTime,
              duration: data.endTime ? data.endTime - data.startTime : 0,
              eventCount: data.events?.length || 0,
              metadata: data.metadata,
            }
          } catch {
            return null
          }
        })
    )

    // Don't group - treat each snapshot file as a separate recording entry
    // Create unique IDs by combining sessionId + filename timestamp
    const snapshots = allRecordings.filter(Boolean).map((rec: any) => ({
      ...rec,
      // Create unique session ID from filename timestamp to treat each snapshot as separate
      sessionId: `${rec.sessionId}_${rec.filename.split('_')[1]}`, // e.g. session_123_2026-01-18T10-09-45-465Z
      originalSessionId: rec.sessionId, // Keep original for fetching full data
      isSnapshot: true,
      snapshotTimestamp: rec.filename.split('_')[1], // Extract timestamp from filename
      fileTimestamp: rec.filename.split('_')[1] // For sorting
    }))

    // Sort by file timestamp (chronological order) so first recording shows as 0:00
    const uniqueRecordings = snapshots.sort((a, b) => a.fileTimestamp.localeCompare(b.fileTimestamp))
      .sort((a, b) => b.startTime - a.startTime)

    return NextResponse.json({
      recordings: uniqueRecordings
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('[API] Error fetching recordings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recordings' },
      { status: 500, headers: corsHeaders }
    )
  }
}
