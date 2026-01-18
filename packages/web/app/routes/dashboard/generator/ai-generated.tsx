import { Card, CardContent } from "~/components/ui/card";
import { Sparkles, Layout, MessageSquare, Send } from "lucide-react";
import type { Route } from "./+types/ai-generated";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Generated - Website Generator" },
    { name: "description", content: "Generate websites using AI" },
  ];
}

export default function AIGeneratedView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Generated
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Generate website variations using AI
        </p>
      </div>

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
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
