/**
 * Amplitude Provider
 * 
 * React context for managing Amplitude connection state.
 * Auto-initializes from environment variables if available.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { initializeAmplitude, isAmplitudeConnected, type AmplitudeConfig } from '~/lib/amplitude'

interface AmplitudeContextType {
    isConnected: boolean
    isLoading: boolean
    error: string | null
    connect: (config: AmplitudeConfig) => Promise<void>
    disconnect: () => void
}

const AmplitudeContext = createContext<AmplitudeContextType | undefined>(undefined)

interface AmplitudeProviderProps {
    children: ReactNode
}

export function AmplitudeProvider({ children }: AmplitudeProviderProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Check if already connected
        setIsConnected(isAmplitudeConnected())

        // Try to auto-initialize from environment variables
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

        // If we have required config, initialize
        if (envConfig.apiKey && envConfig.projectId && !isAmplitudeConnected()) {
            try {
                initializeAmplitude(envConfig as AmplitudeConfig)
                setIsConnected(true)
                console.log('[Amplitude] Connected via environment variables')
            } catch (err) {
                console.error('[Amplitude] Failed to initialize:', err)
                setError(err instanceof Error ? err.message : 'Failed to initialize Amplitude')
            }
        }
    }, [])

    const connect = async (config: AmplitudeConfig) => {
        setIsLoading(true)
        setError(null)

        try {
            initializeAmplitude(config)
            setIsConnected(true)
            setIsLoading(false)
            console.log('[Amplitude] Connected successfully')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to Amplitude')
            setIsLoading(false)
            setIsConnected(false)
        }
    }

    const disconnect = () => {
        setIsConnected(false)
        setError(null)
        console.log('[Amplitude] Disconnected')
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

export function useAmplitudeConnection() {
    const context = useContext(AmplitudeContext)
    if (context === undefined) {
        throw new Error('useAmplitudeConnection must be used within an AmplitudeProvider')
    }
    return context
}
