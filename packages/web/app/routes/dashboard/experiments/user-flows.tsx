import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Eye, Brain, Play, Pause, RefreshCw, Video, Loader2, Clock, AlertCircle, MousePointer, Scroll, FormInput, Timer, Focus, Activity, Monitor, Zap } from "lucide-react";
import type { Route } from "./+types/user-flows";
import { useRecordingsList, useRecording } from "~/hooks/use-recordings";
import { formatDuration, type RecordingMetadata } from "~/lib/recordings";
import { SessionPlayer } from "~/components/session-player";
import { analyzeRecording, formatFlowDuration, formatMs, type FlowAnalysis } from "~/lib/flow-analysis";

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

  // Analyze recordings to extract flow data
  const flowAnalysisA = useMemo<FlowAnalysis | null>(() => {
    if (!recordingDataA || !recordingDataA.events?.length) return null;
    return analyzeRecording(recordingDataA);
  }, [recordingDataA]);

  const flowAnalysisB = useMemo<FlowAnalysis | null>(() => {
    if (!recordingDataB || !recordingDataB.events?.length) return null;
    return analyzeRecording(recordingDataB);
  }, [recordingDataB]);

  // Aggregate stats for all recordings
  const statsA = useMemo(() => {
    const count = recordingsA?.length || 0;
    const avgDuration = recordingsA ? recordingsA.reduce((sum, r) => sum + r.duration, 0) / (count || 1) : 0;
    return { count, avgDuration };
  }, [recordingsA]);

  const statsB = useMemo(() => {
    const count = recordingsB?.length || 0;
    const avgDuration = recordingsB ? recordingsB.reduce((sum, r) => sum + r.duration, 0) / (count || 1) : 0;
    return { count, avgDuration };
  }, [recordingsB]);

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
          <span className="text-xs text-muted-foreground font-normal ml-2">
            (from selected recordings)
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {/* Version A Flow */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">Version A (Original)</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {statsA.count} sessions
              </span>
            </div>
            <CardContent className="p-4 flex-1">
              {flowAnalysisA ? (
                <div className="space-y-4">
                  {/* Pathway */}
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Pathway</div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="p-2 border rounded bg-background text-center flex-1">
                        Start
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                      <div className="p-2 border rounded bg-background text-center flex-1">
                        Scroll {Math.round(flowAnalysisA.maxScrollDepth)}px
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                      <div className={`p-2 border rounded text-center flex-1 ${flowAnalysisA.exitType === 'completed'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : flowAnalysisA.exitType === 'abandoned'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-muted'
                        }`}>
                        {flowAnalysisA.exitType === 'completed' ? 'Engaged' :
                          flowAnalysisA.exitType === 'abandoned' ? 'Bounce' : 'Exit'}
                      </div>
                    </div>
                  </div>

                  {/* Engagement Score */}
                  <div className="p-2 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Engagement
                      </span>
                      <span className={`text-sm font-bold ${flowAnalysisA.engagementScore >= 60 ? 'text-green-600' :
                        flowAnalysisA.engagementScore >= 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {flowAnalysisA.engagementScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${flowAnalysisA.engagementScore >= 60 ? 'bg-green-500' :
                          flowAnalysisA.engagementScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${flowAnalysisA.engagementScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border rounded-lg text-center">
                      <MousePointer className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-base font-semibold">{flowAnalysisA.totalClicks}</div>
                      <div className="text-[10px] text-muted-foreground">Clicks</div>
                    </div>
                    <div className="p-2 border rounded-lg text-center">
                      <Scroll className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-base font-semibold">{flowAnalysisA.totalScrolls}</div>
                      <div className="text-[10px] text-muted-foreground">Scrolls</div>
                    </div>
                    <div className="p-2 border rounded-lg text-center">
                      <FormInput className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-base font-semibold">{flowAnalysisA.totalInputs}</div>
                      <div className="text-[10px] text-muted-foreground">Inputs</div>
                    </div>
                  </div>

                  {/* Time & Activity */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Timer className="h-3 w-3" />
                        First Click
                      </div>
                      <div className="text-sm font-medium">{formatMs(flowAnalysisA.timeToFirstClick)}</div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Activity className="h-3 w-3" />
                        Mouse Moves
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisA.totalMouseMoves}</div>
                    </div>
                  </div>

                  {/* More Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Focus className="h-3 w-3" />
                        Focus Events
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisA.totalFocusEvents}</div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Activity className="h-3 w-3" />
                        DOM Mutations
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisA.totalMutations}</div>
                    </div>
                  </div>

                  {/* Viewport & Duration */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Monitor className="h-3 w-3" />
                        Viewport
                      </div>
                      <div className="text-sm font-medium">
                        {flowAnalysisA.viewport.width}×{flowAnalysisA.viewport.height}
                      </div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        Duration
                      </div>
                      <div className="text-sm font-medium">{formatFlowDuration(flowAnalysisA.sessionDuration)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a recording to see flow</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Version B Flow */}
          <Card className="flex flex-col gap-0 py-0 overflow-hidden">
            <div className="p-3 border-b bg-blue-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Version B (Generated)</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {statsB.count} sessions
              </span>
            </div>
            <CardContent className="p-4 flex-1">
              {flowAnalysisB ? (
                <div className="space-y-4">
                  {/* Pathway */}
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Pathway</div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="p-2 border rounded bg-background text-center flex-1">
                        Start
                      </div>
                      <ArrowRight className="h-4 w-4 text-blue-500 mx-1" />
                      <div className="p-2 border rounded bg-background text-center flex-1">
                        Scroll {Math.round(flowAnalysisB.maxScrollDepth)}px
                      </div>
                      <ArrowRight className="h-4 w-4 text-blue-500 mx-1" />
                      <div className={`p-2 border rounded text-center flex-1 ${flowAnalysisB.exitType === 'completed'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : flowAnalysisB.exitType === 'abandoned'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                        {flowAnalysisB.exitType === 'completed' ? 'Engaged' :
                          flowAnalysisB.exitType === 'abandoned' ? 'Bounce' : 'Exit'}
                      </div>
                    </div>
                  </div>

                  {/* Engagement Score */}
                  <div className="p-2 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Engagement
                      </span>
                      <span className={`text-sm font-bold ${flowAnalysisB.engagementScore >= 60 ? 'text-green-600' :
                        flowAnalysisB.engagementScore >= 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {flowAnalysisB.engagementScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${flowAnalysisB.engagementScore >= 60 ? 'bg-green-500' :
                          flowAnalysisB.engagementScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${flowAnalysisB.engagementScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border rounded-lg text-center">
                      <MousePointer className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                      <div className="text-base font-semibold">{flowAnalysisB.totalClicks}</div>
                      <div className="text-[10px] text-muted-foreground">Clicks</div>
                    </div>
                    <div className="p-2 border rounded-lg text-center">
                      <Scroll className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                      <div className="text-base font-semibold">{flowAnalysisB.totalScrolls}</div>
                      <div className="text-[10px] text-muted-foreground">Scrolls</div>
                    </div>
                    <div className="p-2 border rounded-lg text-center">
                      <FormInput className="h-3 w-3 mx-auto mb-1 text-blue-500" />
                      <div className="text-base font-semibold">{flowAnalysisB.totalInputs}</div>
                      <div className="text-[10px] text-muted-foreground">Inputs</div>
                    </div>
                  </div>

                  {/* Time & Activity */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Timer className="h-3 w-3" />
                        First Click
                      </div>
                      <div className="text-sm font-medium">{formatMs(flowAnalysisB.timeToFirstClick)}</div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Activity className="h-3 w-3" />
                        Mouse Moves
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisB.totalMouseMoves}</div>
                    </div>
                  </div>

                  {/* More Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Focus className="h-3 w-3" />
                        Focus Events
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisB.totalFocusEvents}</div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Activity className="h-3 w-3" />
                        DOM Mutations
                      </div>
                      <div className="text-sm font-medium">{flowAnalysisB.totalMutations}</div>
                    </div>
                  </div>

                  {/* Viewport & Duration */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Monitor className="h-3 w-3" />
                        Viewport
                      </div>
                      <div className="text-sm font-medium">
                        {flowAnalysisB.viewport.width}×{flowAnalysisB.viewport.height}
                      </div>
                    </div>
                    <div className="p-2 border rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        Duration
                      </div>
                      <div className="text-sm font-medium">{formatFlowDuration(flowAnalysisB.sessionDuration)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No Version B recordings</p>
                </div>
              )}
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
