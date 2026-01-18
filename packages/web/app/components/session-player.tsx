/**
 * Session Player Component
 * 
 * Plays back multiple rrweb session recordings sequentially like a video
 * Combines multiple sessions into one continuous playback
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Recording } from '~/lib/recordings'
import { Play, Loader2 } from 'lucide-react'

interface SessionPlayerProps {
  recordings: Recording[]
  isPlaying: boolean
  onPlayPause: () => void
  onTimeUpdate?: (currentTime: number, totalDuration: number, currentSessionIndex: number) => void
}

export interface SessionPlayerRef {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
  getTotalDuration: () => number
}

export function SessionPlayer({
  recordings,
  isPlaying,
  onPlayPause,
  onTimeUpdate,
}: SessionPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState(0)
  const animationFrameRef = useRef<number | null>(null)

  // Calculate total duration of all sessions combined
  const totalDuration = recordings.reduce((sum, rec) => {
    const duration = rec.events?.length > 1 
      ? rec.events[rec.events.length - 1].timestamp - rec.events[0].timestamp
      : rec.duration || 0
    return sum + duration
  }, 0)

  // Calculate session offsets (cumulative durations)
  const sessionOffsets = recordings.reduce<number[]>((offsets, rec, index) => {
    if (index === 0) return [0]
    const prevDuration = recordings[index - 1].events?.length > 1
      ? recordings[index - 1].events[recordings[index - 1].events.length - 1].timestamp - recordings[index - 1].events[0].timestamp
      : recordings[index - 1].duration || 0
    return [...offsets, offsets[offsets.length - 1] + prevDuration]
  }, [0])

  // Get duration of a specific session
  const getSessionDuration = useCallback((rec: Recording) => {
    if (!rec.events?.length) return 0
    if (rec.events.length === 1) return rec.duration || 0
    return rec.events[rec.events.length - 1].timestamp - rec.events[0].timestamp
  }, [])

  // Load a specific session into the player
  const loadSession = useCallback(async (sessionIndex: number) => {
    if (!recordings[sessionIndex] || !containerRef.current) return false

    const recording = recordings[sessionIndex]
    
    if (!recording.events || recording.events.length === 0) {
      setError('No events in recording')
      return false
    }

    try {
      // Clear previous player
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }

      const { default: rrwebPlayer } = await import('rrweb-player')
      await import('rrweb-player/dist/style.css')

      playerRef.current = new rrwebPlayer({
        target: containerRef.current!,
        props: {
          events: recording.events,
          width: containerRef.current!.offsetWidth,
          height: containerRef.current!.offsetHeight,
          autoPlay: false,
          showController: false,
          skipInactive: true,
          speed: 1,
          UNSAFE_replayCanvas: false,
          mouseTail: false,
        },
      })

      // Set the offset time for this session
      setSessionStartTime(sessionOffsets[sessionIndex] || 0)
      setCurrentSessionIndex(sessionIndex)
      setIsLoaded(true)
      setError(null)

      return true
    } catch (err) {
      console.error('Failed to load player:', err)
      setError('Failed to load recording player')
      return false
    }
  }, [recordings, sessionOffsets])

  // Initialize first session
  useEffect(() => {
    if (recordings.length > 0) {
      loadSession(0)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (playerRef.current) {
        try {
          playerRef.current.pause()
        } catch (e) {}
        playerRef.current = null
      }
    }
  }, [recordings])

  // Handle play/pause
  useEffect(() => {
    if (!playerRef.current || !isLoaded) return

    if (isPlaying) {
      playerRef.current.play()
    } else {
      playerRef.current.pause()
    }
  }, [isPlaying, isLoaded])

  // Track playback time and handle session transitions
  useEffect(() => {
    if (!playerRef.current || !isLoaded || !isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const updateTime = () => {
      if (!playerRef.current || !isPlaying) return

      try {
        const replayer = playerRef.current.getReplayer?.()
        const currentTimeInSession = replayer?.getCurrentTime?.() || 0
        const currentSessionDuration = getSessionDuration(recordings[currentSessionIndex])
        
        // Calculate global time (across all sessions)
        const globalTime = sessionStartTime + currentTimeInSession
        
        // Report time update
        if (onTimeUpdate) {
          onTimeUpdate(globalTime, totalDuration, currentSessionIndex)
        }

        // Check if current session ended - move to next session
        if (currentTimeInSession >= currentSessionDuration - 100 && currentSessionIndex < recordings.length - 1) {
          // Move to next session
          const nextIndex = currentSessionIndex + 1
          playerRef.current.pause()
          loadSession(nextIndex).then((loaded) => {
            if (loaded && isPlaying) {
              setTimeout(() => {
                playerRef.current?.play()
              }, 100)
            }
          })
          return
        }

        // If this is the last session and it ended, stop playing
        if (currentTimeInSession >= currentSessionDuration - 100 && currentSessionIndex === recordings.length - 1) {
          onPlayPause() // Stop playing
          return
        }
      } catch (e) {
        // Ignore errors during time tracking
      }

      animationFrameRef.current = requestAnimationFrame(updateTime)
    }

    animationFrameRef.current = requestAnimationFrame(updateTime)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPlaying, isLoaded, currentSessionIndex, sessionStartTime, recordings, totalDuration, onTimeUpdate, onPlayPause, getSessionDuration, loadSession])

  // Seek to a specific global time
  const seekToTime = useCallback((globalTime: number) => {
    if (!recordings.length) return

    // Find which session this time falls into
    let targetSession = 0
    let timeWithinSession = globalTime

    for (let i = 0; i < recordings.length; i++) {
      const sessionDuration = getSessionDuration(recordings[i])
      if (timeWithinSession <= sessionDuration) {
        targetSession = i
        break
      }
      timeWithinSession -= sessionDuration
      if (i === recordings.length - 1) {
        targetSession = i
        timeWithinSession = sessionDuration
      }
    }

    if (targetSession !== currentSessionIndex) {
      // Need to load a different session
      loadSession(targetSession).then((loaded) => {
        if (loaded && playerRef.current) {
          playerRef.current.goto(Math.max(0, timeWithinSession))
          if (isPlaying) {
            playerRef.current.play()
          }
        }
      })
    } else if (playerRef.current) {
      // Same session, just seek
      playerRef.current.goto(Math.max(0, timeWithinSession))
    }
  }, [recordings, currentSessionIndex, loadSession, isPlaying, getSessionDuration])

  // Expose seek function via a custom event on the container
  useEffect(() => {
    if (!containerRef.current) return
    
    const handleSeek = (e: CustomEvent<{ time: number }>) => {
      seekToTime(e.detail.time)
    }

    containerRef.current.addEventListener('seek', handleSeek as EventListener)
    return () => {
      containerRef.current?.removeEventListener('seek', handleSeek as EventListener)
    }
  }, [seekToTime])

  if (!recordings.length) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No recordings available</p>
          <p className="text-xs mt-1 opacity-60">Record sessions to see playback</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video bg-gradient-to-br from-red-900/20 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="aspect-video bg-black rounded-lg overflow-hidden"
        style={{ minHeight: '200px' }}
      />
      {/* Session indicator */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Session {currentSessionIndex + 1} / {recordings.length}
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading player...</span>
        </div>
      )}
    </div>
  )
}
