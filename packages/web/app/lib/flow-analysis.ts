/**
 * Flow Analysis Library
 * 
 * Analyzes rrweb recordings to extract user flow data
 * for the Flow Comparison visualization
 */

import type { Recording, RecordingMetadata } from './recordings'

// rrweb event types
const EventType = {
    DomContentLoaded: 0,
    Load: 1,
    FullSnapshot: 2,
    IncrementalSnapshot: 3,
    Meta: 4,
    Custom: 5,
    Plugin: 6,
} as const

// IncrementalSource types within IncrementalSnapshot
const IncrementalSource = {
    Mutation: 0,
    MouseMove: 1,
    MouseInteraction: 2,
    Scroll: 3,
    ViewportResize: 4,
    Input: 5,
    TouchMove: 6,
    MediaInteraction: 7,
    StyleSheetRule: 8,
    CanvasMutation: 9,
    Font: 10,
    Log: 11,
    Drag: 12,
    StyleDeclaration: 13,
    Selection: 14,
    AdoptedStyleSheet: 15,
} as const

// Mouse interaction types
const MouseInteractions = {
    MouseUp: 0,
    MouseDown: 1,
    Click: 2,
    ContextMenu: 3,
    DblClick: 4,
    Focus: 5,
    Blur: 6,
    TouchStart: 7,
    TouchMove_Departed: 8,
    TouchEnd: 9,
    TouchCancel: 10,
} as const

export interface FlowStep {
    type: 'page' | 'click' | 'scroll' | 'input' | 'exit'
    label: string
    timestamp: number
    details?: string
}

export interface FlowAnalysis {
    steps: FlowStep[]
    // Interaction counts
    totalClicks: number
    totalScrolls: number
    totalInputs: number
    totalMouseMoves: number
    totalFocusEvents: number
    totalMutations: number
    // Scroll metrics
    maxScrollDepth: number
    avgScrollSpeed: number
    // Time metrics
    sessionDuration: number
    timeToFirstClick: number
    timeToFirstScroll: number
    avgTimeBetweenClicks: number
    // Engagement
    engagementScore: number
    exitType: 'completed' | 'abandoned' | 'unknown'
    // Page info
    pageUrl: string
    viewport: { width: number; height: number }
    userAgent: string
}

export interface AggregatedFlowStats {
    totalSessions: number
    avgDuration: number
    avgClicks: number
    avgScrollDepth: number
    completionRate: number
    topPages: { name: string; count: number; percentage: number }[]
    exitPoints: { name: string; count: number; percentage: number }[]
}

/**
 * Analyze a single recording to extract flow data
 */
export function analyzeRecording(recording: Recording): FlowAnalysis {
    const events = recording.events || []
    const steps: FlowStep[] = []

    // Counters
    let totalClicks = 0
    let totalScrolls = 0
    let totalInputs = 0
    let totalMouseMoves = 0
    let totalFocusEvents = 0
    let totalMutations = 0
    let maxScrollDepth = 0

    // Time tracking
    const startTime = recording.startTime
    const endTime = recording.endTime || Date.now()
    let firstClickTime: number | null = null
    let firstScrollTime: number | null = null
    const clickTimestamps: number[] = []
    const scrollYValues: number[] = []

    // Get page info from metadata
    const pageUrl = recording.metadata?.url || 'Unknown'
    const viewport = recording.metadata?.viewport || { width: 0, height: 0 }
    const userAgent = recording.metadata?.userAgent || 'Unknown'

    // Add landing page as first step
    const pageName = extractPageName(pageUrl)
    steps.push({
        type: 'page',
        label: pageName,
        timestamp: startTime,
        details: pageUrl
    })

    // Process events
    for (const event of events) {
        if (event.type === EventType.IncrementalSnapshot && event.data) {
            const source = event.data.source

            // DOM Mutations
            if (source === IncrementalSource.Mutation) {
                totalMutations++
            }

            // Mouse movements
            if (source === IncrementalSource.MouseMove) {
                totalMouseMoves++
            }

            // Mouse interactions (clicks, focus, etc)
            if (source === IncrementalSource.MouseInteraction) {
                const interactionType = event.data.type

                if (interactionType === MouseInteractions.Click) {
                    totalClicks++
                    clickTimestamps.push(event.timestamp)
                    if (firstClickTime === null) {
                        firstClickTime = event.timestamp
                    }
                    steps.push({
                        type: 'click',
                        label: 'Click',
                        timestamp: event.timestamp,
                        details: `Element ID: ${event.data.id || 'unknown'}`
                    })
                }

                if (interactionType === MouseInteractions.Focus || interactionType === MouseInteractions.Blur) {
                    totalFocusEvents++
                }
            }

            // Scroll events
            if (source === IncrementalSource.Scroll) {
                totalScrolls++
                const scrollY = event.data.y || 0
                scrollYValues.push(scrollY)
                if (scrollY > maxScrollDepth) {
                    maxScrollDepth = scrollY
                }
                if (firstScrollTime === null) {
                    firstScrollTime = event.timestamp
                }
            }

            // Input events
            if (source === IncrementalSource.Input) {
                totalInputs++
                steps.push({
                    type: 'input',
                    label: 'Input',
                    timestamp: event.timestamp,
                    details: 'Form interaction'
                })
            }
        }
    }

    // Calculate derived metrics
    const sessionDuration = endTime - startTime
    const timeToFirstClick = firstClickTime ? firstClickTime - startTime : sessionDuration
    const timeToFirstScroll = firstScrollTime ? firstScrollTime - startTime : sessionDuration

    // Average time between clicks
    let avgTimeBetweenClicks = 0
    if (clickTimestamps.length > 1) {
        let totalGap = 0
        for (let i = 1; i < clickTimestamps.length; i++) {
            totalGap += clickTimestamps[i] - clickTimestamps[i - 1]
        }
        avgTimeBetweenClicks = totalGap / (clickTimestamps.length - 1)
    }

    // Average scroll speed (pixels per scroll event)
    const avgScrollSpeed = scrollYValues.length > 1
        ? scrollYValues.reduce((sum, y, i) => i > 0 ? sum + Math.abs(y - scrollYValues[i - 1]) : sum, 0) / (scrollYValues.length - 1)
        : 0

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(100, Math.round(
        (Math.min(totalClicks, 10) * 5) + // Up to 50 points for clicks
        (Math.min(totalScrolls, 20) * 1) + // Up to 20 points for scrolls
        (Math.min(totalInputs, 5) * 6) + // Up to 30 points for inputs
        (Math.min(sessionDuration / 1000, 60) * 0.5) // Up to 30 points for duration
    ))

    // Determine exit type based on activity
    let exitType: 'completed' | 'abandoned' | 'unknown' = 'unknown'
    if (totalInputs > 0 || engagementScore > 60) {
        exitType = 'completed' // High engagement
    } else if (totalClicks < 2 && totalScrolls < 5 && sessionDuration < 10000) {
        exitType = 'abandoned' // Bounced quickly
    }

    // Add exit step
    steps.push({
        type: 'exit',
        label: exitType === 'completed' ? 'Completed' : exitType === 'abandoned' ? 'Bounced' : 'Exit',
        timestamp: endTime,
        details: `After ${Math.round(sessionDuration / 1000)}s`
    })

    return {
        steps,
        totalClicks,
        totalScrolls,
        totalInputs,
        totalMouseMoves,
        totalFocusEvents,
        totalMutations,
        maxScrollDepth,
        avgScrollSpeed,
        sessionDuration,
        timeToFirstClick,
        timeToFirstScroll,
        avgTimeBetweenClicks,
        engagementScore,
        exitType,
        pageUrl,
        viewport,
        userAgent
    }
}

/**
 * Aggregate flow stats from multiple recordings
 */
export function aggregateFlowStats(recordings: RecordingMetadata[], recordingDetails: (Recording | null)[]): AggregatedFlowStats {
    const validRecordings = recordingDetails.filter((r): r is Recording => r !== null && r.events?.length > 0)

    if (validRecordings.length === 0) {
        return {
            totalSessions: 0,
            avgDuration: 0,
            avgClicks: 0,
            avgScrollDepth: 0,
            completionRate: 0,
            topPages: [],
            exitPoints: []
        }
    }

    const analyses = validRecordings.map(analyzeRecording)

    const totalSessions = analyses.length
    const avgDuration = analyses.reduce((sum, a) => sum + a.sessionDuration, 0) / totalSessions
    const avgClicks = analyses.reduce((sum, a) => sum + a.totalClicks, 0) / totalSessions
    const avgScrollDepth = analyses.reduce((sum, a) => sum + a.maxScrollDepth, 0) / totalSessions

    const completed = analyses.filter(a => a.exitType === 'completed').length
    const completionRate = (completed / totalSessions) * 100

    // Count pages
    const pageCounts: Record<string, number> = {}
    for (const rec of validRecordings) {
        const pageName = extractPageName(rec.metadata?.url || '')
        pageCounts[pageName] = (pageCounts[pageName] || 0) + 1
    }

    const topPages = Object.entries(pageCounts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalSessions) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // Count exit types
    const exitCounts: Record<string, number> = {}
    for (const analysis of analyses) {
        const exit = analysis.exitType
        exitCounts[exit] = (exitCounts[exit] || 0) + 1
    }

    const exitPoints = Object.entries(exitCounts)
        .map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            percentage: Math.round((count / totalSessions) * 100)
        }))
        .sort((a, b) => b.count - a.count)

    return {
        totalSessions,
        avgDuration,
        avgClicks,
        avgScrollDepth,
        completionRate,
        topPages,
        exitPoints
    }
}

/**
 * Extract a friendly page name from URL
 */
function extractPageName(url: string): string {
    try {
        const urlObj = new URL(url)
        const path = urlObj.pathname
        if (path === '/' || path === '') return 'Home'
        const parts = path.split('/').filter(Boolean)
        if (parts.length === 0) return 'Home'
        return parts[parts.length - 1]
            .replace(/-/g, ' ')
            .replace(/^\w/, c => c.toUpperCase())
    } catch {
        return 'Unknown'
    }
}

/**
 * Format duration in human-readable format
 */
export function formatFlowDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
}

/**
 * Format milliseconds to seconds with 1 decimal
 */
export function formatMs(ms: number): string {
    return `${(ms / 1000).toFixed(1)}s`
}
