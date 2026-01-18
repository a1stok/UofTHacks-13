import { Card, CardContent } from "~/components/ui/card";
import { PenTool, Layout, Settings } from "lucide-react";
import type { Route } from "./+types/manual";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manual - Website Generator" },
    { name: "description", content: "Build your website manually" },
  ];
}

export default function ManualView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PenTool className="h-5 w-5 text-green-600" />
          Manual
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manually customize your website variations
        </p>
      </div>

      {/* Side by Side Preview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original Website */}
        <Card className="overflow-hidden gap-0 py-0">
          <div className="p-3 border-b bg-muted/50 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
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
        <Card className="overflow-hidden gap-0 py-0">
          <div className="p-3 border-b bg-green-50/50 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
      <Card className="gap-0 py-0">
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
            Learn more
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
