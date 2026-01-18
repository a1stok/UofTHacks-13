import { useEffect, useRef, useState } from 'react'
import { Recording } from '@/lib/recordings'

interface SessionPlayerProps {
  recording: Recording | null
  isPlaying: boolean
  progress: number
  onProgressChange: (progress: number) => void
  onPlayPause: () => void
  syncedWith?: SessionPlayerRef
}

export interface SessionPlayerRef {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
}

export function SessionPlayer({
  recording,
  isPlaying,
  progress,
  onProgressChange,
  onPlayPause,
}: SessionPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!recording || !containerRef.current) return

    // Dynamic import of rrweb-player since it uses browser-only APIs
    const loadPlayer = async () => {
      try {
        // Check if we have valid events
        if (!recording.events || recording.events.length === 0) {
          setError('No events in recording')
          return
        }

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
            showController: false, // We'll use our own controls
            skipInactive: true,
            speed: 1,
          },
        })

        setIsLoaded(true)
        setError(null)
      } catch (err) {
        console.error('Failed to load player:', err)
        setError('Failed to load recording player')
      }
    }

    loadPlayer()

    return () => {
      if (playerRef.current) {
        playerRef.current.pause()
        playerRef.current = null
      }
    }
  }, [recording])

  useEffect(() => {
    if (!playerRef.current || !isLoaded) return

    if (isPlaying) {
      playerRef.current.play()
    } else {
      playerRef.current.pause()
    }
  }, [isPlaying, isLoaded])

  useEffect(() => {
    if (!playerRef.current || !isLoaded || !recording) return

    const totalDuration = recording.endTime - recording.startTime
    const seekTime = (progress / 100) * totalDuration
    
    // Only seek if the difference is significant
    const currentTime = playerRef.current.getCurrentTime?.() || 0
    if (Math.abs(currentTime - seekTime) > 500) {
      playerRef.current.goto(seekTime)
    }
  }, [progress, isLoaded, recording])

  if (!recording) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No recording selected</p>
          <p className="text-xs mt-1 opacity-60">Select a recording to play</p>
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
    <div 
      ref={containerRef} 
      className="aspect-video bg-black rounded-lg overflow-hidden"
      style={{ minHeight: '200px' }}
    />
  )
}
