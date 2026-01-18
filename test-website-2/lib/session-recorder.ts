'use client'

import { record } from 'rrweb'

export interface SessionRecording {
  sessionId: string
  version: string
  startTime: number
  endTime?: number
  events: any[]
  metadata: {
    url: string
    userAgent: string
    viewport: { width: number; height: number }
  }
}

class SessionRecorder {
  private events: any[] = []
  private sessionId: string = ''
  private startTime: number = 0
  private stopFn: (() => void) | null = null
  private version: string = 'A' // Default version, can be set dynamically
  private saveInterval: NodeJS.Timeout | null = null
  private isRecording: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionId = this.generateSessionId()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setVersion(version: string) {
    this.version = version
  }

  start() {
    if (typeof window === 'undefined' || this.isRecording) return

    this.events = []
    this.startTime = Date.now()
    this.sessionId = this.generateSessionId()
    this.isRecording = true

    console.log(`[SessionRecorder] Starting recording for ${this.version}`, this.sessionId)

    this.stopFn = record({
      emit: (event) => {
        this.events.push(event)
      },
      // Capture all mutations
      checkoutEveryNms: 10000,
      // Mask sensitive data
      maskAllInputs: false,
      // Record canvas
      recordCanvas: true,
      // Sample scroll events
      sampling: {
        scroll: 150,
        input: 'last',
        mousemove: false,
      },
    })

    // Auto-save every 30 seconds
    this.saveInterval = setInterval(() => {
      this.saveRecording()
    }, 30000)

    // Save on page unload
    window.addEventListener('beforeunload', this.handleUnload)
    window.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleUnload = () => {
    this.saveRecording()
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.saveRecording()
    }
  }

  stop() {
    if (this.stopFn) {
      this.stopFn()
      this.stopFn = null
    }

    if (this.saveInterval) {
      clearInterval(this.saveInterval)
      this.saveInterval = null
    }

    window.removeEventListener('beforeunload', this.handleUnload)
    window.removeEventListener('visibilitychange', this.handleVisibilityChange)

    this.isRecording = false
    this.saveRecording()
  }

  async saveRecording() {
    if (this.events.length === 0) return

    const recording: SessionRecording = {
      sessionId: this.sessionId,
      version: this.version,
      startTime: this.startTime,
      endTime: Date.now(),
      events: [...this.events],
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    }

    try {
      const response = await fetch('/api/recordings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recording),
      })

      if (response.ok) {
        console.log(`[SessionRecorder] Recording saved: ${this.sessionId}`)
      } else {
        console.error('[SessionRecorder] Failed to save recording:', response.statusText)
      }
    } catch (error) {
      console.error('[SessionRecorder] Error saving recording:', error)
    }
  }

  getSessionId(): string {
    return this.sessionId
  }

  getEvents(): any[] {
    return this.events
  }

  isActive(): boolean {
    return this.isRecording
  }
}

// Singleton instance
let recorder: SessionRecorder | null = null

export function getSessionRecorder(): SessionRecorder {
  if (!recorder) {
    recorder = new SessionRecorder()
  }
  return recorder
}

export function startRecording(version: string = 'A') {
  const r = getSessionRecorder()
  r.setVersion(version)
  r.start()
}

export function stopRecording() {
  const r = getSessionRecorder()
  r.stop()
}
