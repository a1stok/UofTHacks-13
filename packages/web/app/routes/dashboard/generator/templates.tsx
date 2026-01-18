import { Plug } from "lucide-react";
import type { Route } from "./+types/templates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MCP - Website Generator" },
    { name: "description", content: "Model Context Protocol integration" },
  ];
}

export default function MCPView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Plug className="h-5 w-5 text-blue-600" />
          MCP
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Model Context Protocol integration
        </p>
      </div>
    </div>
  );
}
