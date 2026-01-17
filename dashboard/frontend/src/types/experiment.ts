export interface AmplitudeEvent {
  event_type: string
  user_id: string
  timestamp: number
  event_properties: Record<string, any>
  user_properties: Record<string, any>
}

export interface AmplitudeSessionReplay {
  session_id: string
  user_id: string
  start_time: number
  end_time: number
  duration: number
  events: Array<{
    type: string
    timestamp: number
    data: any
  }>
}

export interface AmplitudeHeatmapData {
  element_selector: string
  clicks: number
  x: number
  y: number
  intensity: number
  page_url: string
}

export interface AmplitudeMetrics {
  conversion_rate: number
  session_duration: number
  bounce_rate: number
  page_views: number
  unique_users: number
  retention_rate: number
}

export interface DashboardView {
  id: string
  name: string
}

export interface AmplitudeApiResponse<T> {
  data: T[]
  next_page?: string
  has_more: boolean
}