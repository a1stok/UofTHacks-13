'use client'

import { useEffect, useState } from 'react'
import { startRecording, stopRecording, getSessionRecorder } from '../lib/session-recorder'

interface SessionRecorderProviderProps {
  children: React.ReactNode
  version?: string
  enabled?: boolean
}

export function SessionRecorderProvider({ 
  children, 
  version = 'A',
  enabled = true 
}: SessionRecorderProviderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startRecording(version)
      const recorder = getSessionRecorder()
      setSessionId(recorder.getSessionId())
      setIsRecording(true)
      console.log(`[Provider] Recording started for version ${version}`)
    }, 100)

    return () => {
      clearTimeout(timer)
      stopRecording()
      setIsRecording(false)
      console.log('[Provider] Recording stopped')
    }
  }, [version, enabled])

  return (
    <>
      {children}
      {/* Recording indicator - small dot in corner */}
      {isRecording && (
        <div 
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full"
          title={`Recording: ${sessionId}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Recording
        </div>
      )}
    </>
  )
}
