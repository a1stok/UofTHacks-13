import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { 
  Paintbrush,
  MessageSquare,
  Settings,
  Layout,
  Send
} from 'lucide-react'

interface WebsiteGeneratorViewProps {
  subView?: string
}

export function WebsiteGeneratorView({ subView }: WebsiteGeneratorViewProps) {
  const [currentTab, setCurrentTab] = useState('templates')
  
  // Sync with sidebar sub-navigation
  useEffect(() => {
    if (subView) {
      const parts = subView.split('.')
      const tabId = parts.length > 1 ? parts[1] : 'templates'
      if (['templates', 'ai', 'manual'].includes(tabId)) {
        setCurrentTab(tabId)
      }
    }
  }, [subView])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    { id: 'modern', name: 'Modern', color: 'bg-blue-100' },
    { id: 'minimal', name: 'Minimal', color: 'bg-gray-100' },
    { id: 'bold', name: 'Bold', color: 'bg-orange-100' },
    { id: 'elegant', name: 'Elegant', color: 'bg-purple-100' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Paintbrush className="h-6 w-6 text-blue-600" />
          Website Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create alternative website designs for A/B testing
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Side by Side Preview */}
          <div className="grid grid-cols-2 gap-4">
            {/* Original Website */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">Original</span>
              </div>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your website</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">
                  {selectedTemplate ? `Template: ${templates.find(t => t.id === selectedTemplate)?.name}` : 'Select a template'}
                </span>
              </div>
              <CardContent className="p-0">
                <div className={`aspect-[4/3] flex items-center justify-center ${selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.color : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                  <div className="text-center text-muted-foreground">
                    <Paintbrush className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{selectedTemplate ? 'Template preview' : 'Choose below'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Gallery */}
          <div>
            <h3 className="text-sm font-medium mb-3">Choose a Template</h3>
            <div className="grid grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-transparent hover:border-gray-300'
                  } ${template.color}`}
                >
                  <div className="aspect-video bg-white/50 rounded mb-2"></div>
                  <span className="text-xs font-medium">{template.name}</span>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* AI Generated Tab */}
        <TabsContent value="ai" className="space-y-6">
          {/* Side by Side Preview */}
          <div className="grid grid-cols-2 gap-4">
            {/* Original Website */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">Original</span>
              </div>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your website</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Generated Preview */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">AI Generated</span>
              </div>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">AI-generated design</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Chat Messages Area */}
                <div className="h-32 border rounded-lg p-3 bg-muted/30 overflow-y-auto">
                  <p className="text-sm text-muted-foreground">
                    Describe how you want to modify your website...
                  </p>
                </div>
                
                {/* Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g., Make the hero section more modern with a gradient background"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Tab */}
        <TabsContent value="manual" className="space-y-6">
          {/* Side by Side Preview */}
          <div className="grid grid-cols-2 gap-4">
            {/* Original Website */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">Original</span>
              </div>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your website</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Edit Preview */}
            <Card className="overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <span className="text-sm font-medium">Manual Edit</span>
              </div>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your edits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manual Info */}
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-2">Manual Feature Experiment</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Use Amplitude's Feature Experiment SDK to manually control variants 
                with code-based feature flags for advanced customization.
              </p>
              <a 
                href="https://amplitude.com/docs/feature-experiment" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-3 inline-block"
              >
                Learn more →
              </a>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
