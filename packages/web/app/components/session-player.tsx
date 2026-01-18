import { useEffect, useRef, useState } from 'react'
import type { Recording } from '~/lib/recordings'
import { Play, Loader2 } from 'lucide-react'

interface SessionPlayerProps {
  recording: Recording | null
  isPlaying: boolean
  onPlayingChange?: (isPlaying: boolean) => void
}

export function SessionPlayer({
  recording,
  isPlaying,
  onPlayingChange,
}: SessionPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!recording || !containerRef.current) return

    const loadPlayer = async () => {
      try {
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
            showController: false,
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

  if (!recording) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-75">No recording selected</p>
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
    <div className="relative">
      <div 
        ref={containerRef} 
        className="aspect-video bg-black rounded-lg overflow-hidden"
        style={{ minHeight: '200px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading player...</span>
        </div>
      )}
    </div>
  )
}
