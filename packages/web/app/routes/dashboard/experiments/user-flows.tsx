import { useState, useEffect } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Eye, Brain, Play, Pause, RefreshCw, Video, Loader2, Clock, AlertCircle } from "lucide-react";
import type { Route } from "./+types/user-flows";
import { useRecordingsList, useRecording } from "~/hooks/use-recordings";
import { formatDuration, type RecordingMetadata } from "~/lib/recordings";
import { SessionPlayer } from "~/components/session-player";

export function meta({ }: Route.MetaArgs) {
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

  // Fetch recordings from test-website
  const {
    data: recordingsA,
    isLoading: recordingsALoading,
    isFetched: recordingsAFetched,
    error: errorA,
    refetch: refetchA
  } = useRecordingsList('A');

  const {
    data: recordingsB,
    isLoading: recordingsBLoading,
    isFetched: recordingsBFetched,
    error: errorB,
    refetch: refetchB
  } = useRecordingsList('B');

  const { data: recordingDataA, isLoading: recordingDataALoading } = useRecording(selectedRecordingA);
  const { data: recordingDataB, isLoading: recordingDataBLoading } = useRecording(selectedRecordingB);

  // Debug logging
  useEffect(() => {
    console.log('[UserFlows] Recordings A:', {
      loading: recordingsALoading,
      fetched: recordingsAFetched,
      count: recordingsA?.length || 0,
      error: errorA
    });
    console.log('[UserFlows] Recordings B:', {
      loading: recordingsBLoading,
      fetched: recordingsBFetched,
      count: recordingsB?.length || 0,
      error: errorB
    });
  }, [recordingsA, recordingsB, recordingsALoading, recordingsBLoading]);

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

  // Helper to determine what to show for Version A player
  const renderVersionAContent = () => {
    // Only show loading if actually loading and not yet fetched
    if (recordingsALoading && !recordingsAFetched) {
      return (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading recordings...</span>
        </div>
      );
    }

    // Show error state
    if (errorA) {
      return (
        <div className="aspect-video bg-red-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-70" />
            <p className="text-sm">Failed to load recordings</p>
            <p className="text-xs opacity-70 mt-1">Check if test-website is running</p>
          </div>
        </div>
      );
    }

    // Loading specific recording
    if (recordingDataALoading && selectedRecordingA) {
      return (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading session...</span>
        </div>
      );
    }

    // Has recording data with events
    if (recordingDataA && recordingDataA.events?.length > 0) {
      return (
        <SessionPlayer
          recording={recordingDataA}
          isPlaying={isPlayingA}
          progress={progressA}
          onProgressChange={(val) => {
            setProgressA(val);
            if (isSynced) setProgressB(val);
          }}
          onPlayPause={() => {
            const newState = !isPlayingA;
            setIsPlayingA(newState);
            if (isSynced) setIsPlayingB(newState);
          }}
        />
      );
    }

    // Empty state - no recordings available
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Play className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-75">No recordings yet</p>
          <p className="text-xs opacity-50 mt-1">Visit test-website to record</p>
        </div>
      </div>
    );
  };

  // Helper to determine what to show for Version B player
  const renderVersionBContent = () => {
    if (recordingsBLoading && !recordingsBFetched) {
      return (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading recordings...</span>
        </div>
      );
    }

    if (errorB) {
      return (
        <div className="aspect-video bg-red-50 flex items-center justify-center">
          <div className="text-center text-red-600">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-70" />
            <p className="text-sm">Failed to load recordings</p>
            <p className="text-xs opacity-70 mt-1">Check if test-website is running</p>
          </div>
        </div>
      );
    }

    if (recordingDataBLoading && selectedRecordingB) {
      return (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading session...</span>
        </div>
      );
    }

    if (recordingDataB && recordingDataB.events?.length > 0) {
      return (
        <SessionPlayer
          recording={recordingDataB}
          isPlaying={isPlayingB}
          progress={progressB}
          onProgressChange={(val) => {
            setProgressB(val);
            if (isSynced) setProgressA(val);
          }}
          onPlayPause={() => {
            const newState = !isPlayingB;
            setIsPlayingB(newState);
            if (isSynced) setIsPlayingA(newState);
          }}
        />
      );
    }

    return (
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Play className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-75">No recordings yet</p>
          <p className="text-xs opacity-50 mt-1">Generate Version B first</p>
        </div>
      </div>
    );
  };

  const hasRecordingsA = recordingsA && recordingsA.length > 0;
  const hasRecordingsB = recordingsB && recordingsB.length > 0;

  return (
    <div className="space-y-8">
      {/* Session Recordings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Video className="h-5 w-5" />
            Session Recordings
            {(hasRecordingsA || hasRecordingsB) && (
              <span className="text-xs text-muted-foreground font-normal">
                ({(recordingsA?.length || 0) + (recordingsB?.length || 0)} total)
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${recordingsALoading || recordingsBLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={isSynced ? handleStop : handleSyncPlay}
              className={`px-3 py-1.5 text-sm border rounded transition-colors ${isSynced ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-muted'
                }`}
              disabled={!hasRecordingsA && !hasRecordingsB}
            >
              {isSynced ? "Stop Sync" : "Sync Play"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Version A Video */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">Version A</span>
                {hasRecordingsA && (
                  <span className="text-xs text-muted-foreground">
                    ({recordingsA.length})
                  </span>
                )}
              </div>
              {hasRecordingsA && (
                <select
                  value={selectedRecordingA || ''}
                  onChange={(e) => setSelectedRecordingA(e.target.value)}
                  className="text-xs border rounded-md px-2 py-1.5 bg-background max-w-[180px]"
                >
                  {recordingsA.map((rec: RecordingMetadata, index: number) => (
                    <option key={rec.sessionId} value={rec.sessionId}>
                      Session {recordingsA.length - index} · {formatDuration(rec.duration)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <CardContent className="p-0">
              {renderVersionAContent()}
              {/* Controls */}
              <div className="p-3 border-t flex items-center gap-3">
                <button
                  onClick={() => {
                    const newState = !isPlayingA;
                    setIsPlayingA(newState);
                    if (isSynced) setIsPlayingB(newState);
                  }}
                  className="p-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={!recordingDataA?.events?.length}
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
                      const val = Number(e.target.value);
                      setProgressA(val);
                      if (isSynced) setProgressB(val);
                    }}
                    className="w-full"
                    disabled={!recordingDataA?.events?.length}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {recordingDataA ? formatDuration(recordingDataA.duration || 0) : '--:--'}
                </span>
              </div>
              {hasRecordingsA && (
                <div className="px-3 pb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{recordingsA.length} recording{recordingsA.length !== 1 ? 's' : ''} available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version B Video */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Version B</span>
                {hasRecordingsB && (
                  <span className="text-xs text-muted-foreground">
                    ({recordingsB.length})
                  </span>
                )}
              </div>
              {hasRecordingsB && (
                <select
                  value={selectedRecordingB || ''}
                  onChange={(e) => setSelectedRecordingB(e.target.value)}
                  className="text-xs border rounded-md px-2 py-1.5 bg-background max-w-[180px]"
                >
                  {recordingsB.map((rec: RecordingMetadata, index: number) => (
                    <option key={rec.sessionId} value={rec.sessionId}>
                      Session {recordingsB.length - index} · {formatDuration(rec.duration)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <CardContent className="p-0">
              {renderVersionBContent()}
              {/* Controls */}
              <div className="p-3 border-t flex items-center gap-3">
                <button
                  onClick={() => {
                    const newState = !isPlayingB;
                    setIsPlayingB(newState);
                    if (isSynced) setIsPlayingA(newState);
                  }}
                  className="p-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={!recordingDataB?.events?.length}
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
                      const val = Number(e.target.value);
                      setProgressB(val);
                      if (isSynced) setProgressA(val);
                    }}
                    className="w-full"
                    disabled={!recordingDataB?.events?.length}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {recordingDataB ? formatDuration(recordingDataB.duration || 0) : '--:--'}
                </span>
              </div>
              {hasRecordingsB && (
                <div className="px-3 pb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{recordingsB.length} recording{recordingsB.length !== 1 ? 's' : ''} available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flow Comparison */}
      <div>
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Flow Comparison
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {/* Version A Flow */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm font-medium">Version A (Original)</span>
            </div>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg text-center text-sm bg-background hover:bg-muted/50 transition-colors">Landing</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <div className="p-3 border rounded-lg text-center text-sm bg-background hover:bg-muted/50 transition-colors">Product</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <div className="p-3 border rounded-lg text-center text-sm bg-muted border-red-200 text-red-700">
                  Exit (65%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version B Flow */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Version B (Generated)</span>
            </div>
            <CardContent className="p-4 flex-1">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg text-center text-sm bg-background hover:bg-muted/50 transition-colors">Landing</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <div className="p-3 border rounded-lg text-center text-sm bg-background hover:bg-muted/50 transition-colors">Product</div>
                <div className="flex justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <div className="p-3 border rounded-lg text-center text-sm bg-blue-50 border-blue-200 text-blue-700">
                  Convert (43%)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Flow Analysis */}
      <div>
        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Flow Analysis
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {/* Version A Analysis */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm font-medium">Version A Journey</span>
            </div>
            <CardContent className="p-4 space-y-3 flex-1">
              <div className="text-sm space-y-2">
                <div className="p-3 bg-muted/30 rounded-lg text-sm border">
                  <strong className="text-foreground">1. Landing:</strong> <span className="text-muted-foreground">button.hero-cta clicked → delay: 3.2s</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-sm border">
                  <strong className="text-foreground">2. Product:</strong> <span className="text-muted-foreground">div.product-info scrolled → 45% depth</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-sm border">
                  <strong className="text-foreground">3. Form:</strong> <span className="text-muted-foreground">input[type="email"] focused → abandoned</span>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <strong className="text-red-700">Drop-off:</strong> <span className="text-red-600">65% users exit at signup form</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version B Analysis */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Version B Journey</span>
            </div>
            <CardContent className="p-4 space-y-3 flex-1">
              <div className="text-sm space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
                  <strong className="text-blue-700">1. Landing:</strong> <span className="text-blue-600">button.hero-cta clicked → delay: 1.8s</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
                  <strong className="text-blue-700">2. Product:</strong> <span className="text-blue-600">div.product-info scrolled → 78% depth</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
                  <strong className="text-blue-700">3. Form:</strong> <span className="text-blue-600">input[type="email"] focused → completed</span>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <strong className="text-green-700">Success:</strong> <span className="text-green-600">43% users complete signup (+28%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
