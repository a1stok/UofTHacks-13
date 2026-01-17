export interface AmplitudeConfig {
  apiKey: string
  apiSecret?: string
  projectId: string
  baseUrl?: string
}

export const AMPLITUDE_ENDPOINTS = {
  EVENTS: '/events',
  COHORTS: '/cohorts',
  USER_ACTIVITY: '/useractivity', 
  DASHBOARD: '/dashboard',
  CHARTS: '/charts',
  SESSIONS: '/sessions',
  RECORDINGS: '/recordings',
  EXPERIMENTS: '/experiments',
  FLAGS: '/flags'
} as const

export class AmplitudeService {
  private config: AmplitudeConfig
  private baseUrl: string

  constructor(config: AmplitudeConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://amplitude.com/api/2'
  }

  async getEvents(params: any): Promise<any[]> {
    throw new Error('Amplitude integration not yet implemented')
  }

  async getMetrics(params: any): Promise<any> {
    throw new Error('Amplitude integration not yet implemented')  
  }

  async getHeatmapData(params: any): Promise<any[]> {
    throw new Error('Amplitude integration not yet implemented')
  }

  async getSessionReplays(params: any): Promise<any[]> {
    throw new Error('Amplitude integration not yet implemented')
  }

  async getCohorts(params: any): Promise<any> {
    throw new Error('Amplitude integration not yet implemented')
  }
}

let amplitudeService: AmplitudeService | null = null

export const getAmplitudeService = (): AmplitudeService => {
  if (!amplitudeService) {
    throw new Error('Amplitude service not configured. Call initializeAmplitude() first.')
  }
  return amplitudeService
}

export const initializeAmplitude = (config: AmplitudeConfig) => {
  amplitudeService = new AmplitudeService(config)
  return amplitudeService
}

export const isAmplitudeConnected = (): boolean => {
  return amplitudeService !== null
}