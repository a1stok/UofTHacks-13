import { useState } from 'react'
import { DashboardLayout } from './layout/DashboardLayout'
import { WebsiteGeneratorView } from './views/WebsiteGeneratorView'
import { ABTestingView } from './views/ABTestingView'

export function Dashboard() {
  const [currentView, setCurrentView] = useState('generator')

  const renderView = () => {
    const [mainView] = currentView.split('.')
    
    switch (mainView) {
      case 'generator':
        return <WebsiteGeneratorView subView={currentView} />
      case 'experiments':
        return <ABTestingView subView={currentView} />
      default:
        return <WebsiteGeneratorView subView={currentView} />
    }
  }

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </DashboardLayout>
  )
}