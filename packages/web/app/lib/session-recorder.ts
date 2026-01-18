export interface SessionRecording {
  sessionId: string
  version: string
  startTime: number
  endTime: number
  duration: number
  events: any[]
  isComplete: boolean
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
  private version: string = 'A'
  private isRecording: boolean = false
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null
  private lastActivity: number = 0
  private hasSaved: boolean = false

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

  async start() {
    if (typeof window === 'undefined' || this.isRecording) return

    this.events = []
    this.startTime = Date.now()
    this.lastActivity = Date.now()
    this.sessionId = this.generateSessionId()
    this.isRecording = true
    this.hasSaved = false

    console.log(`[SessionRecorder] Starting recording for ${this.version}`, this.sessionId)

    // Dynamic import to avoid SSR issues
    const { record } = await import('rrweb')
    
    this.stopFn = record({
      emit: (event) => {
        this.events.push(event)
        this.updateActivity()
      },
      checkoutEveryNms: 10000,
      maskAllInputs: false,
      recordCanvas: true,
      sampling: {
        scroll: 150,
        input: 'last',
        mousemove: false,
      },
    }) || null

    // Set up inactivity detection (saves after 30s of no activity)
    this.setupInactivityDetection()

    // Save on page unload
    window.addEventListener('beforeunload', this.handleUnload)
    window.addEventListener('visibilitychange', this.handleVisibilityChange)
    
    // Add activity listeners
    window.addEventListener('mousemove', this.handleActivity)
    window.addEventListener('keydown', this.handleActivity)
    window.addEventListener('click', this.handleActivity)
    window.addEventListener('scroll', this.handleActivity)
  }

  private handleUnload = () => {
    this.saveRecording()
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Stop recording and save when tab becomes hidden
      console.log('[SessionRecorder] Tab hidden, stopping recording')
      this.stop()
    }
  }

  private handleActivity = () => {
    this.updateActivity()
  }

  private updateActivity() {
    this.lastActivity = Date.now()
    this.resetInactivityTimer()
  }

  private setupInactivityDetection() {
    this.resetInactivityTimer()
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
    }

    // Stop recording after 30 seconds of inactivity
    this.inactivityTimer = setTimeout(() => {
      if (this.isRecording) {
        console.log('[SessionRecorder] 30s inactivity detected, stopping recording')
        this.stop()
      }
    }, 30000) // 30 seconds
  }

  stop() {
    if (!this.isRecording) return
    
    if (this.stopFn) {
      this.stopFn()
      this.stopFn = null
    }

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
      this.inactivityTimer = null
    }

    // Remove all event listeners
    window.removeEventListener('beforeunload', this.handleUnload)
    window.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('mousemove', this.handleActivity)
    window.removeEventListener('keydown', this.handleActivity)
    window.removeEventListener('click', this.handleActivity)
    window.removeEventListener('scroll', this.handleActivity)

    this.isRecording = false
    
    // Save only once when stopping
    if (!this.hasSaved) {
      this.saveRecording()
    }
  }

  async saveRecording() {
    if (this.events.length === 0 || this.hasSaved) return
    
    this.hasSaved = true
    const endTime = Date.now()
    const duration = endTime - this.startTime

    const recording: SessionRecording = {
      sessionId: this.sessionId,
      version: this.version,
      startTime: this.startTime,
      endTime,
      duration,
      events: [...this.events],
      isComplete: true,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    }

    console.log(`[SessionRecorder] Saving complete recording: ${this.sessionId}`)
    console.log(`[SessionRecorder] Duration: ${(duration / 1000).toFixed(1)}s, Events: ${recording.events.length}`)

    try {
      // Use test-website API for saving recordings (it has CORS enabled)
      const apiUrl = 'http://localhost:3000/api/recordings'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recording),
      })

      if (response.ok) {
        console.log(`[SessionRecorder] Recording saved successfully!`)
        
        // Dispatch custom event to notify dashboard
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sessionRecordingSaved', {
            detail: { sessionId: this.sessionId, version: this.version }
          }))
        }
      } else {
        console.error('[SessionRecorder] Failed to save recording:', response.statusText)
        this.hasSaved = false // Allow retry
      }
    } catch (error) {
      console.error('[SessionRecorder] Error saving recording:', error)
      this.hasSaved = false // Allow retry
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

export async function startRecording(version: string = 'A') {
  const r = getSessionRecorder()
  r.setVersion(version)
  await r.start()
}

export function stopRecording() {
  const r = getSessionRecorder()
  r.stop()
}
