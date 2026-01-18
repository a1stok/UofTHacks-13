import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { GitBranch, Play, Pause } from "lucide-react";
import type { Route } from "./+types/paired-overview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paired Overview - Experiments" },
    { name: "description", content: "Compare test variants side by side" },
  ];
}

export default function PairedOverviewView() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            Paired Overview
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Compare test variants side by side with synchronized playback
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
    </div>
  );
}
