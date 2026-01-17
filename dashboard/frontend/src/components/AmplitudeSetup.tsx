/**
 * Amplitude Setup Component
 * 
 * This component will handle the initial Amplitude configuration
 * when the user wants to connect their account
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { useAmplitude } from './AmplitudeProvider'
import { 
  Settings, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface AmplitudeSetupProps {
  onComplete?: () => void
}

export function AmplitudeSetup({ onComplete }: AmplitudeSetupProps) {
  const { connect, isLoading, error } = useAmplitude()
  const [config, setConfig] = useState({
    apiKey: '',
    apiSecret: '',
    projectId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config.apiKey || !config.projectId) {
      return
    }

    await connect({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret || undefined,
      projectId: config.projectId
    })

    if (onComplete) {
      onComplete()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amplitude-blue" />
          Connect Amplitude
        </CardTitle>
        <CardDescription>
          Connect your Amplitude project to start viewing analytics data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="text"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Enter your Amplitude API key"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID *</Label>
            <Input
              id="projectId"
              type="text"
              value={config.projectId}
              onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              placeholder="Enter your project ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret (optional)</Label>
            <Input
              id="apiSecret"
              type="password"
              value={config.apiSecret}
              onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
              placeholder="Enter API secret for advanced features"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              type="submit" 
              disabled={isLoading || !config.apiKey || !config.projectId}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connect to Amplitude
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://amplitude.com/docs/analytics/apis/api-keys', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Find my API credentials
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Where to find your credentials:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>1. Go to Amplitude → Settings → Projects</li>
            <li>2. Select your project</li>
            <li>3. Copy the API Key and Project ID</li>
            <li>4. For API Secret: Settings → API Keys</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            💡 <strong>Tip:</strong> You can also set these via environment variables 
            (<code className="text-xs">VITE_AMPLITUDE_API_KEY</code>, 
            <code className="text-xs">VITE_AMPLITUDE_PROJECT_ID</code>) 
            for automatic connection. See <code className="text-xs">AMPLITUDE_KEYS_GUIDE.md</code> for details.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}