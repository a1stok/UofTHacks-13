import { QueryProvider } from './providers/QueryProvider'
import { AmplitudeProvider } from './components/AmplitudeProvider'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <QueryProvider>
      <AmplitudeProvider>
        <div className="min-h-screen bg-background">
          <Dashboard />
        </div>
      </AmplitudeProvider>
    </QueryProvider>
  )
}

export default App