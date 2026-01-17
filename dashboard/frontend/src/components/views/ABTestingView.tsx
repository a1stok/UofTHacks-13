import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { 
  FlaskConical,
  ArrowRight,
  Play,
  Pause,
  Brain,
  Eye
} from 'lucide-react'

interface ABTestingViewProps {
  subView?: string
}

export function ABTestingView({ subView }: ABTestingViewProps) {
  const [currentTab, setCurrentTab] = useState('overview')
  const [isPlayingA, setIsPlayingA] = useState(false)
  const [isPlayingB, setIsPlayingB] = useState(false)
  const [isSynced, setIsSynced] = useState(false)
  const [progressA, setProgressA] = useState(0)
  const [progressB, setProgressB] = useState(0)
  
  // Sync with sidebar sub-navigation
  useEffect(() => {
    if (subView) {
      const parts = subView.split('.')
      const tabId = parts.length > 1 ? parts[1] : 'overview'
      if (['overview', 'flows'].includes(tabId)) {
        setCurrentTab(tabId)
      }
    }
  }, [subView])

  const handleSyncPlay = () => {
    setIsSynced(true)
    setIsPlayingA(true)
    setIsPlayingB(true)
  }

  const handleStop = () => {
    setIsSynced(false)
    setIsPlayingA(false)
    setIsPlayingB(false)
    setProgressA(0)
    setProgressB(0)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-blue-600" />
            A/B Testing
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compare website performance and user behavior
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">
            A/B/C Testing • Plus Plan from $49/mo
          </span>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">

        {/* Paired Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Comparison */}
          <div className="grid grid-cols-2 gap-6">
            {/* Version A */}
            <Card>
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <div>
                      <h3 className="font-semibold">Version A (Original)</h3>
                      <p className="text-xs text-muted-foreground">Control Group</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Primary Metrics */}
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Average Session Duration</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version B */}
            <Card>
              <div className="p-4 border-b bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold">Version B (Generated)</h3>
                      <p className="text-xs text-muted-foreground">Variant Group</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Primary Metrics */}
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div className="pb-4 border-b">
                    <div className="text-xs text-muted-foreground mb-1">Average Session Duration</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
                    <div className="text-3xl font-bold">—</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Experiment Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Statistical Significance</div>
                <div className="text-2xl font-bold mb-1">—</div>
                <div className="text-xs text-muted-foreground">Confidence level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Total Participants</div>
                <div className="text-2xl font-bold mb-1">—</div>
                <div className="text-xs text-muted-foreground">Users tested</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Experiment Duration</div>
                <div className="text-2xl font-bold mb-1">—</div>
                <div className="text-xs text-muted-foreground">Days running</div>
              </CardContent>
            </Card>
          </div>

          {/* Status Message */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Connect Amplitude SDK to see live experiment data
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Flows Tab */}
        <TabsContent value="flows" className="space-y-8">
          {/* Video Session Recordings - First */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Play className="h-5 w-5" />
                Session Recordings
              </h3>
              <button
                onClick={isSynced ? handleStop : handleSyncPlay}
                className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
              >
                {isSynced ? 'Stop Sync' : 'Sync Play'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Version A Video */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-sm font-medium">Version A</span>
                </div>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-b-lg flex items-center justify-center relative">
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Session recording</p>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="p-3 space-y-2 border-t">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newState = !isPlayingA
                          setIsPlayingA(newState)
                          if (isSynced) setIsPlayingB(newState)
                        }}
                        className="p-2 border rounded hover:bg-muted"
                      >
                        {isPlayingA ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressA}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            setProgressA(val)
                            if (isSynced) setProgressB(val)
                          }}
                          className="w-full"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">2:34</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Version B Video */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Version B</span>
                </div>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-b-lg flex items-center justify-center relative">
                    <div className="text-center text-white">
                      <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Session recording</p>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="p-3 space-y-2 border-t">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newState = !isPlayingB
                          setIsPlayingB(newState)
                          if (isSynced) setIsPlayingA(newState)
                        }}
                        className="p-2 border rounded hover:bg-muted"
                      >
                        {isPlayingB ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressB}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            setProgressB(val)
                            if (isSynced) setProgressA(val)
                          }}
                          className="w-full"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">1:47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Flow Comparison - Second */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Flow Comparison
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Version A Flow */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-sm font-medium">Version A (Original)</span>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="p-2 border rounded text-center text-sm">Landing</div>
                    <div className="flex justify-center"><ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" /></div>
                    <div className="p-2 border rounded text-center text-sm">Product</div>
                    <div className="flex justify-center"><ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" /></div>
                    <div className="p-2 border rounded text-center text-sm bg-muted">Exit (65%)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Version B Flow */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Version B (Generated)</span>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="p-2 border rounded text-center text-sm">Landing</div>
                    <div className="flex justify-center"><ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" /></div>
                    <div className="p-2 border rounded text-center text-sm">Product</div>
                    <div className="flex justify-center"><ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" /></div>
                    <div className="p-2 border rounded text-center text-sm bg-blue-50">Convert (43%)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Flow Analysis - Third */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Flow Analysis
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Version A Analysis */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-sm font-medium">Version A Journey</span>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="p-2 bg-muted/30 rounded text-sm">
                      <strong>1. Landing:</strong> button.hero-cta clicked → delay: 3.2s
                    </div>
                    <div className="p-2 bg-muted/30 rounded text-sm">
                      <strong>2. Product:</strong> div.product-info scrolled → 45% depth
                    </div>
                    <div className="p-2 bg-muted/30 rounded text-sm">
                      <strong>3. Form:</strong> input[type="email"] focused → abandoned
                    </div>
                    <div className="p-2 bg-muted border border-black/20 rounded text-sm">
                      <strong>Drop-off:</strong> 65% users exit at signup form
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Version B Analysis */}
              <Card>
                <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Version B Journey</span>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <strong>1. Landing:</strong> button.hero-cta clicked → delay: 1.8s
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <strong>2. Product:</strong> div.product-info scrolled → 78% depth
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <strong>3. Form:</strong> input[type="email"] focused → completed
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <strong>Success:</strong> 43% users complete signup (+28%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
