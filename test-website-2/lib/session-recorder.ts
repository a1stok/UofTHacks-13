'use client'

import { record } from 'rrweb'

// Amplitude integration for natural session tracking
declare global {
  interface Window {
    amplitude?: {
      getSessionId(): number
      getDeviceId(): string
      getUserId(): string | null
      track(eventName: string, eventProperties?: any): void
    }
  }
}

export interface SessionRecording {
  sessionId: string
  amplitudeSessionId?: number
  amplitudeDeviceId?: string
  amplitudeUserId?: string | null
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
  private stopFn: (() => void) | undefined | null = null
  private version: string = 'B' // Default version for test-website-2
  private saveInterval: NodeJS.Timeout | null = null
  private isRecording: boolean = false
  private maxEvents: number = 5000 // Prevent memory issues

  constructor() {
    if (typeof window !== 'undefined') {
        this.sessionId = this.generateSessionId()
    }
  }

  private generateSessionId(): string {
    // Use Amplitude session ID for natural session tracking
    if (typeof window !== 'undefined' && window.amplitude) {
      try {
        const ampSessionId = window.amplitude.getSessionId()
        if (ampSessionId) {
          return `session_${ampSessionId}_${this.version}`
        }
      } catch (e) {
        console.warn('[SessionRecorder] Could not get Amplitude session ID:', e)
      }
    }
    
    // Fallback to timestamp-based ID
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setVersion(version: string) {
    this.version = version
  }

  start() {
    if (typeof window === 'undefined' || this.isRecording) return

    this.events = []
    this.startTime = Date.now()

    // Generate NEW session ID for each page load
    this.sessionId = this.generateSessionId()
    this.isRecording = true

    console.log(`[SessionRecorder] Starting recording for ${this.version}`, this.sessionId)

    // Track session start in Amplitude
    this.trackAmplitudeEvent('Session Recording Started', {
      version: this.version,
      sessionId: this.sessionId,
      recordingStartTime: this.startTime
    })

    this.stopFn = record({
      emit: (event) => {
        this.events.push(event)
        
        // Prevent memory issues by limiting events
        if (this.events.length > this.maxEvents) {
          console.log(`[SessionRecorder] Reached ${this.maxEvents} events, clearing old ones`)
          this.events = this.events.slice(-this.maxEvents * 0.8) // Keep last 80%
        }
      },
      // Capture all mutations
      checkoutEveryNms: 10000,
      // Mask sensitive data
      maskAllInputs: false,
      // Record canvas
      recordCanvas: true,
      // Optimized sampling to prevent too many events
      sampling: {
        scroll: 150, // Reasonable scroll sampling
        input: 'last', // Only capture final input values
        mousemove: 250, // Throttle mouse movement (every 250ms)
        mouseInteraction: true,
      },
    })

    // Save frequently for smooth video (every 2 seconds)
    this.saveInterval = setInterval(() => {
      this.saveRecording()
    }, 2000)

    // Listen for user engagement for additional saves
    this.setupEngagementListeners()

    // Save on page unload
    window.addEventListener('beforeunload', this.handleUnload)
    window.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleUnload = () => {
    this.saveRecording()
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Only save, don't stop recording when tab becomes hidden
      this.saveRecording()
    }
  }

  stop() {
    if (!this.isRecording) return

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
    
    // Track session end in Amplitude
    const duration = Date.now() - this.startTime
    this.trackAmplitudeEvent('Session Recording Ended', {
      version: this.version,
      sessionId: this.sessionId,
      duration: duration,
      eventCount: this.events.length
    })

    this.saveRecording()
  }

  private trackAmplitudeEvent(eventName: string, properties: any = {}) {
    // Optional Amplitude tracking (don't let it interfere with recording)
    try {
      if (typeof window !== 'undefined' && window.amplitude) {
        window.amplitude.track(eventName, properties)
      }
    } catch (e) {
      // Silently ignore Amplitude errors
    }
  }

  private getAmplitudeData() {
    // Optional Amplitude data (don't let it interfere with recording)
    try {
      if (typeof window !== 'undefined' && window.amplitude) {
        return {
          amplitudeSessionId: window.amplitude.getSessionId(),
          amplitudeDeviceId: window.amplitude.getDeviceId(),
          amplitudeUserId: window.amplitude.getUserId(),
        }
      }
    } catch (e) {
      // Silently ignore Amplitude errors
    }
    return {}
  }

  async saveRecording() {
    if (this.events.length === 0) return

    const recording: SessionRecording = {
      sessionId: this.sessionId,
      version: this.version,
      startTime: this.startTime,
      endTime: Date.now(),
      events: [...this.events],
      ...this.getAmplitudeData(), // Include Amplitude session data
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
      // Strict port assignment: Version B -> Port 3002
      const targetPort = '3002'
      let saved = false

      try {
        const response = await fetch(`http://localhost:${targetPort}/api/recordings`, {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recording),
          signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (response.ok) {
          saved = true
        }
      } catch (e) {
        console.warn(`[SessionRecorder] Failed to save to port ${targetPort}:`, e instanceof Error ? e.message : String(e))
      }

      if (saved) {
        const duration = (recording.endTime! - this.startTime) / 1000
        console.log(`[SessionRecorder] ✓ Version ${this.version} saved to :${targetPort} - ${this.events.length} events (${duration.toFixed(1)}s)`)
      } else {
        console.warn(`[SessionRecorder] ⚠ Version ${this.version} failed to save to :${targetPort} - will retry`)
      }
    } catch (error) {
      console.error('[SessionRecorder] Save error:', error)
    }
  }

  getSessionId(): string {
    return this.sessionId
  }

  getEvents(): any[] {
    return this.events
  }

  private setupEngagementListeners() {
    // Save on major navigation events
    window.addEventListener('popstate', () => {
      this.trackAmplitudeEvent('Navigation', { type: 'popstate' })
      this.saveRecording()
    })
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

export function startRecording(version: string = 'B') {
  const r = getSessionRecorder()
  r.setVersion(version)
  r.start()
}

export function stopRecording() {
  const r = getSessionRecorder()
  r.stop()
}
