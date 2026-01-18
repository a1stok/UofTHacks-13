import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Path to recordings directory - try multiple locations to handle different working directories
function getRecordingsDir(): string {
  const possiblePaths = [
    // Running from test-website folder: ../output/recordings
    path.join(process.cwd(), '..', 'output', 'recordings'),
    // Running from monorepo root via turbo: output/recordings  
    path.join(process.cwd(), 'output', 'recordings'),
    // Explicit path as fallback
    path.resolve('C:/Users/Kostiantyn/Startup/output/recordings'),
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

    // Create filename with version and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${version}_${timestamp}_${sessionId}.json`
    const filepath = path.join(RECORDINGS_DIR, filename)

    // Save recording to file
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

    // If sessionId is provided, return specific recording
    if (sessionId) {
      const files = await readdir(RECORDINGS_DIR)
      const file = files.find(f => f.includes(sessionId))

      if (file) {
        const content = await readFile(path.join(RECORDINGS_DIR, file), 'utf-8')
        return NextResponse.json(JSON.parse(content), { headers: corsHeaders })
      }

      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // List all recordings
    const files = await readdir(RECORDINGS_DIR)
    const recordings = await Promise.all(
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

    return NextResponse.json({
      recordings: recordings.filter(Boolean).sort((a, b) => b!.startTime - a!.startTime)
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('[API] Error fetching recordings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recordings' },
      { status: 500, headers: corsHeaders }
    )
  }
}
