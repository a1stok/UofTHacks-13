import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

export function DashboardLayout({ children, currentView, onViewChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex bg-background">
      <DashboardSidebar 
        isOpen={sidebarOpen} 
        currentView={currentView}
        onViewChange={onViewChange}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}