import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Users, ArrowRight, Eye, Brain, Play, Pause, RefreshCw, Clock, Video, Loader2, ExternalLink } from "lucide-react";
import type { Route } from "./+types/user-flows";
import { useRecordingsList, useRecording } from "~/hooks/use-recordings";
import { formatDuration, formatTimestamp, type RecordingMetadata } from "~/lib/recordings";
import { SessionPlayer } from "~/components/session-player";

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
  const [selectedRecordingA, setSelectedRecordingA] = useState<string | null>(null);
  const [selectedRecordingB, setSelectedRecordingB] = useState<string | null>(null);

  // Fetch recordings from test-website (localhost:3000)
  const { data: recordingsA, isLoading: recordingsALoading, refetch: refetchA } = useRecordingsList('A');
  const { data: recordingsB, isLoading: recordingsBLoading, refetch: refetchB } = useRecordingsList('B');
  const { data: recordingDataA, isLoading: recordingDataALoading } = useRecording(selectedRecordingA);
  const { data: recordingDataB, isLoading: recordingDataBLoading } = useRecording(selectedRecordingB);

  // Auto-select latest recording
  useEffect(() => {
    if (recordingsA && recordingsA.length > 0 && !selectedRecordingA) {
      setSelectedRecordingA(recordingsA[0].sessionId);
    }
  }, [recordingsA, selectedRecordingA]);

  useEffect(() => {
    if (recordingsB && recordingsB.length > 0 && !selectedRecordingB) {
      setSelectedRecordingB(recordingsB[0].sessionId);
    }
  }, [recordingsB, selectedRecordingB]);

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

  const handleRefresh = () => {
    refetchA();
    refetchB();
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={isSynced ? handleStop : handleSyncPlay}
            className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
          >
            {isSynced ? "Stop Sync" : "Sync Play"}
          </button>
        </div>
      </div>

      {/* Session Recordings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <h3 className="text-lg font-medium">Session Recordings</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">test-website</span>
          </div>
          <a 
            href="http://localhost:3000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            Open test-website <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* Version A Video */}
          <Card>
            <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">Version A</span>
              </div>
              {recordingsA && recordingsA.length > 0 && (
                <select
                  value={selectedRecordingA || ''}
                  onChange={(e) => setSelectedRecordingA(e.target.value)}
                  className="text-xs border rounded px-2 py-1 bg-background"
                >
                  {recordingsA.map((rec: RecordingMetadata) => (
                    <option key={rec.sessionId} value={rec.sessionId}>
                      {formatTimestamp(rec.startTime)} ({formatDuration(rec.duration)})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <CardContent className="p-0">
              {recordingsALoading ? (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading recordings...</span>
                </div>
              ) : recordingDataALoading ? (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading session...</span>
                </div>
              ) : recordingsA && recordingsA.length > 0 ? (
                <SessionPlayer
                  recording={recordingDataA || null}
                  isPlaying={isPlayingA}
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">No recordings yet</p>
                    <p className="text-xs opacity-50 mt-1">Visit test-website to start recording</p>
                  </div>
                </div>
              )}
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
                    disabled={!recordingsA || recordingsA.length === 0}
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
                      disabled={!recordingsA || recordingsA.length === 0}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {recordingDataA ? formatDuration(recordingDataA.duration || 0) : '--:--'}
                  </span>
                </div>
                {recordingsA && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{recordingsA.length} screen capture{recordingsA.length !== 1 ? 's' : ''} available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Version B Video */}
          <Card>
            <div className="p-3 border-b bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Version B</span>
              </div>
              {recordingsB && recordingsB.length > 0 && (
                <select
                  value={selectedRecordingB || ''}
                  onChange={(e) => setSelectedRecordingB(e.target.value)}
                  className="text-xs border rounded px-2 py-1 bg-background"
                >
                  {recordingsB.map((rec: RecordingMetadata) => (
                    <option key={rec.sessionId} value={rec.sessionId}>
                      {formatTimestamp(rec.startTime)} ({formatDuration(rec.duration)})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <CardContent className="p-0">
              {recordingsBLoading ? (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading recordings...</span>
                </div>
              ) : recordingDataBLoading ? (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading session...</span>
                </div>
              ) : recordingsB && recordingsB.length > 0 ? (
                <SessionPlayer
                  recording={recordingDataB || null}
                  isPlaying={isPlayingB}
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">No recordings yet</p>
                    <p className="text-xs opacity-50 mt-1">Generate Version B first</p>
                  </div>
                </div>
              )}
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
                    disabled={!recordingsB || recordingsB.length === 0}
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
                      disabled={!recordingsB || recordingsB.length === 0}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {recordingDataB ? formatDuration(recordingDataB.duration || 0) : '--:--'}
                  </span>
                </div>
                {recordingsB && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{recordingsB.length} screen capture{recordingsB.length !== 1 ? 's' : ''} available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
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
