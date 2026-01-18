import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Paintbrush, Layout } from "lucide-react";
import type { Route } from "./+types/templates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Templates - Website Generator" },
    { name: "description", content: "Choose from pre-built website templates" },
  ];
}

const templates = [
  { id: "modern", name: "Modern", color: "bg-blue-100" },
  { id: "minimal", name: "Minimal", color: "bg-gray-100" },
  { id: "bold", name: "Bold", color: "bg-orange-100" },
  { id: "elegant", name: "Elegant", color: "bg-purple-100" },
];

export default function TemplatesView() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-blue-600" />
          Templates
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Choose from pre-built website templates for A/B testing
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

        {/* Template Preview */}
        <Card className="overflow-hidden">
          <div className="p-3 border-b bg-muted/50">
            <span className="text-sm font-medium">
              {selectedTemplate
                ? `Template: ${templates.find((t) => t.id === selectedTemplate)?.name}`
                : "Select a template"}
            </span>
          </div>
          <CardContent className="p-0">
            <div
              className={`aspect-[4/3] flex items-center justify-center ${selectedTemplate ? templates.find((t) => t.id === selectedTemplate)?.color : "bg-gradient-to-br from-blue-50 to-blue-100"}`}
            >
              <div className="text-center text-muted-foreground">
                <Paintbrush className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {selectedTemplate ? "Template preview" : "Choose below"}
                </p>
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
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-transparent hover:border-gray-300"
              } ${template.color}`}
            >
              <div className="aspect-video bg-white/50 rounded mb-2"></div>
              <span className="text-xs font-medium">{template.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
