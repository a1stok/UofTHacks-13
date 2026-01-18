import { Card, CardContent } from "~/components/ui/card";
import { GitBranch, GitCompare } from "lucide-react";
import type { Route } from "./+types/paired-overview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Paired Overview - Experiments" },
    { name: "description", content: "Compare test variants side by side" },
  ];
}

export default function PairedOverviewView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          Paired Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Compare test variants side by side
        </p>
      </div>

      {/* A/B Testing Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            A/B Testing
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage A/B tests
          </p>
        </div>

        {/* Key Metrics Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Version A */}
          <Card>
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div>
                  <h3 className="font-semibold">Version A (Original)</h3>
                  <p className="text-xs text-muted-foreground">Control Group</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Avg Session Duration</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
                <div className="text-3xl font-bold">--</div>
              </div>
            </CardContent>
          </Card>

          {/* Version B */}
          <Card>
            <div className="p-4 border-b bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">Version B (Generated)</h3>
                  <p className="text-xs text-muted-foreground">Variant Group</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Total Visitors</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="pb-4 border-b">
                <div className="text-xs text-muted-foreground mb-1">Avg Session Duration</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Bounce Rate</div>
                <div className="text-3xl font-bold">--</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Experiment Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-xs text-muted-foreground mb-2">Statistical Significance</div>
              <div className="text-2xl font-bold mb-1">--</div>
              <div className="text-xs text-muted-foreground">Confidence level</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-xs text-muted-foreground mb-2">Total Participants</div>
              <div className="text-2xl font-bold mb-1">--</div>
              <div className="text-xs text-muted-foreground">Users tested</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-xs text-muted-foreground mb-2">Experiment Duration</div>
              <div className="text-2xl font-bold mb-1">--</div>
              <div className="text-xs text-muted-foreground">Days running</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        <Card className="bg-muted/30 mt-6">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Connect Amplitude SDK to see live experiment data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
