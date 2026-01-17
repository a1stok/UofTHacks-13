import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Paintbrush,
  FlaskConical,
  ChevronLeft, 
  ChevronRight,
  Home,
  Layout,
  MessageSquare,
  Settings,
  BarChart3,
  GitCompare
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { animate } from '@/animations'

interface DashboardSidebarProps {
  isOpen: boolean
  currentView: string
  onViewChange: (view: string) => void
}

// Primary navigation items with icons
const primaryNavigation = [
  { id: 'generator', name: 'Website Generator', icon: Paintbrush },
  { id: 'experiments', name: 'A/B Testing', icon: FlaskConical },
]

// Contextual navigation for each section
const contextualNavigation: Record<string, Array<{ id: string, name: string, icon: LucideIcon }>> = {
  generator: [
    { id: 'templates', name: 'Templates', icon: Layout },
    { id: 'ai', name: 'AI Generated', icon: MessageSquare },
    { id: 'manual', name: 'Manual', icon: Settings },
  ],
  experiments: [
    { id: 'overview', name: 'Paired Overview', icon: BarChart3 },
    { id: 'flows', name: 'User Flows', icon: GitCompare },
  ]
}

export function DashboardSidebar({ isOpen, currentView, onViewChange }: DashboardSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Track when expansion animation should run
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const prevIsExpanded = useRef(isExpanded)
  
  // Refs for animation targets
  const titleRef = useRef<HTMLSpanElement>(null)
  const navLabelsRef = useRef<HTMLSpanElement[]>([])
  const contextualLabelsRef = useRef<HTMLSpanElement[]>([])
  
  // Get current contextual nav - extract main view from currentView (e.g. "generator.templates" -> "generator")
  const mainView = currentView.split('.')[0]
  const contextualNav = contextualNavigation[mainView] || []
  
  // Clear contextual refs when view changes
  useEffect(() => {
    contextualLabelsRef.current = []
  }, [currentView])
  
  // Ensure visibility of contextual items when expanded and not animating
  useEffect(() => {
    if (isExpanded && !shouldAnimate) {
      // Small delay to allow DOM to update
      const timer = setTimeout(() => {
        // Ensure all text elements are visible
        if (titleRef.current) {
          titleRef.current.style.opacity = '1'
          titleRef.current.style.transform = ''
        }
        navLabelsRef.current.forEach(el => {
          if (el) {
            el.style.opacity = '1'
            el.style.transform = ''
          }
        })
        contextualLabelsRef.current.forEach(el => {
          if (el) {
            el.style.opacity = '1'
            el.style.transform = ''
          }
        })
      }, 50)
      
      return () => clearTimeout(timer)
    }
    return undefined
  }, [currentView, isExpanded, shouldAnimate])

  // Trigger animation only when transitioning from collapsed to expanded
  useEffect(() => {
    if (!prevIsExpanded.current && isExpanded) {
      setShouldAnimate(true)
    }
    prevIsExpanded.current = isExpanded
  }, [isExpanded])

  // Run animation when shouldAnimate is true
  useEffect(() => {
    if (!shouldAnimate || !isExpanded) return

    const targets: HTMLElement[] = []

    // Collect all text elements to animate
    if (titleRef.current) targets.push(titleRef.current)
    navLabelsRef.current.forEach(el => {
      if (el) targets.push(el)
    })
    contextualLabelsRef.current.forEach(el => {
      if (el) targets.push(el)
    })

    if (targets.length > 0) {
      // Set initial hidden state
      targets.forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateX(-15px)'
      })

      // Animate to visible state
      animate(targets, {
        translateX: 0,
        opacity: 1,
        duration: 250,
        delay: (_target, i: number) => i * 30,
        easing: 'easeOutQuart',
        complete: () => {
          // Clean up inline styles after animation
          targets.forEach(el => {
            el.style.opacity = ''
            el.style.transform = ''
          })
          setShouldAnimate(false)
        }
      })
    }
  }, [shouldAnimate, isExpanded])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform bg-background border-r transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: controlled expansion
          isExpanded ? 'lg:w-64' : 'lg:w-16',
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-3 px-6 shrink-0 relative">
          {isExpanded ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amplitude-blue flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span ref={titleRef} className="font-semibold text-lg">
                  Analytics Hub
                </span>
              </div>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Collapse sidebar</span>
              </Button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(true)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Expand sidebar</span>
              </Button>
            </div>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1 px-3 py-4 shrink-0">
          {primaryNavigation.map((item, index) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <div key={item.id} className="relative group">
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full font-normal transition-all',
                    isExpanded ? 'justify-start' : 'justify-center px-0',
                    isActive && 'bg-amplitude-blue/10 text-amplitude-blue border-amplitude-blue/20'
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', isExpanded && 'mr-3')} />
                  {isExpanded && (
                    <span
                      ref={(el) => {
                        if (el) navLabelsRef.current[index] = el
                      }}
                    >
                      {item.name}
                    </span>
                  )}
                </Button>
                {!isExpanded && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                      {item.name}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Contextual Navigation */}
        {isExpanded && contextualNav.length > 0 && (
          <div className="flex-1 px-3 py-4 overflow-y-auto min-h-0 border-t">
            <h3 className="mb-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {primaryNavigation.find(nav => nav.id === mainView)?.name || 'Options'}
            </h3>
            <nav className="space-y-1">
              {contextualNav.map((item, index) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full font-normal justify-start text-sm"
                    onClick={() => onViewChange(`${mainView}.${item.id}`)}
                  >
                    <Icon className="mr-3 h-4 w-4 shrink-0" />
                    <span
                      ref={(el) => {
                        if (el) contextualLabelsRef.current[index] = el
                      }}
                    >
                      {item.name}
                    </span>
                  </Button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Bottom Navigation */}
        {isExpanded && (
          <div className="mt-auto px-3 py-4 shrink-0 border-t">
            <Button
              variant="ghost"
              className="w-full font-normal text-muted-foreground justify-start"
              onClick={() => onViewChange('generator')}
            >
              <Home className="mr-3 h-4 w-4 shrink-0" />
              <span>Dashboard Home</span>
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}