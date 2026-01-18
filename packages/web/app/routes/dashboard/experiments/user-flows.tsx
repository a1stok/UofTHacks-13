import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Users, ArrowRight, Eye, Brain, Play, Pause } from "lucide-react";
import type { Route } from "./+types/user-flows";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Flows - Experiments" },
    { name: "description", content: "Analyze user journey through your tests" },
  ];
}

export default function UserFlowsView() {
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);

  const handleSyncPlay = () => {
    setIsSynced(true);
    setIsPlayingA(true);
    setIsPlayingB(true);
  };

  const handleStop = () => {
    setIsSynced(false);
    setIsPlayingA(false);
    setIsPlayingB(false);
    setProgressA(0);
    setProgressB(0);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            User Flows
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Analyze user journey through your tests
          </p>
        </div>
        <button
          onClick={isSynced ? handleStop : handleSyncPlay}
          className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
        >
          {isSynced ? "Stop Sync" : "Sync Play"}
        </button>
      </div>

      {/* Session Recordings */}
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
                    const newState = !isPlayingA;
                    setIsPlayingA(newState);
                    if (isSynced) setIsPlayingB(newState);
                  }}
                  className="p-2 border rounded hover:bg-muted"
                >
                  {isPlayingA ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressA}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setProgressA(val);
                      if (isSynced) setProgressB(val);
                    }}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  2:34
                </span>
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
                    const newState = !isPlayingB;
                    setIsPlayingB(newState);
                    if (isSynced) setIsPlayingA(newState);
                  }}
                  className="p-2 border rounded hover:bg-muted"
                >
                  {isPlayingB ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressB}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setProgressB(val);
                      if (isSynced) setProgressA(val);
                    }}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  1:47
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow Comparison */}
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
                <div className="flex justify-center">
                  <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                </div>
                <div className="p-2 border rounded text-center text-sm">Product</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                </div>
                <div className="p-2 border rounded text-center text-sm bg-muted">
                  Exit (65%)
                </div>
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
                <div className="flex justify-center">
                  <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                </div>
                <div className="p-2 border rounded text-center text-sm">Product</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                </div>
                <div className="p-2 border rounded text-center text-sm bg-blue-50">
                  Convert (43%)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Flow Analysis */}
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
                  <strong>1. Landing:</strong> button.hero-cta clicked - delay: 3.2s
                </div>
                <div className="p-2 bg-muted/30 rounded text-sm">
                  <strong>2. Product:</strong> div.product-info scrolled - 45% depth
                </div>
                <div className="p-2 bg-muted/30 rounded text-sm">
                  <strong>3. Form:</strong> input[type="email"] focused - abandoned
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
                  <strong>1. Landing:</strong> button.hero-cta clicked - delay: 1.8s
                </div>
                <div className="p-2 bg-blue-50 rounded text-sm">
                  <strong>2. Product:</strong> div.product-info scrolled - 78% depth
                </div>
                <div className="p-2 bg-blue-50 rounded text-sm">
                  <strong>3. Form:</strong> input[type="email"] focused - completed
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <strong>Success:</strong> 43% users complete signup (+28%)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
