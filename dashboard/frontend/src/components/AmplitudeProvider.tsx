import React, { createContext, useContext, useState, useEffect } from 'react'
import { initializeAmplitude, isAmplitudeConnected, type AmplitudeConfig } from '@/lib/amplitude'

interface AmplitudeContextType {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  connect: (config: AmplitudeConfig) => Promise<void>
  disconnect: () => void
}

const AmplitudeContext = createContext<AmplitudeContextType | undefined>(undefined)

interface AmplitudeProviderProps {
  children: React.ReactNode
}

export function AmplitudeProvider({ children }: AmplitudeProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setIsConnected(isAmplitudeConnected())
    const envConfig: Partial<AmplitudeConfig> = {}
    if (import.meta.env.VITE_AMPLITUDE_API_KEY) {
      envConfig.apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY
    }
    if (import.meta.env.VITE_AMPLITUDE_PROJECT_ID) {
      envConfig.projectId = import.meta.env.VITE_AMPLITUDE_PROJECT_ID
    }
    if (import.meta.env.VITE_AMPLITUDE_API_SECRET) {
      envConfig.apiSecret = import.meta.env.VITE_AMPLITUDE_API_SECRET
    }
    
    if (envConfig.apiKey && envConfig.projectId && !isAmplitudeConnected()) {
      initializeAmplitude(envConfig as AmplitudeConfig)
      setIsConnected(true)
    }
  }, [])

  const connect = async (config: AmplitudeConfig) => {
    setIsLoading(true)
    setError(null)
    
    try {
      initializeAmplitude(config)
      
      setIsConnected(true)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Amplitude')
      setIsLoading(false)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setError(null)
  }

  const value = {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  }

  return (
    <AmplitudeContext.Provider value={value}>
      {children}
    </AmplitudeContext.Provider>
  )
}

export const useAmplitude = () => {
  const context = useContext(AmplitudeContext)
  if (context === undefined) {
    throw new Error('useAmplitude must be used within an AmplitudeProvider')
  }
  return context
}