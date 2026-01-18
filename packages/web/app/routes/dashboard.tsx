import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Card, CardContent } from "~/components/ui/card";
import { Settings, Play, Zap, Eye, GitCompare, MousePointer, ChevronRight, Globe, FlaskConical, LayoutTemplate, Sparkles, PenTool, Users, GitBranch } from "lucide-react";
import type { Route } from "./+types/dashboard";
import amplitude from "../../public/AMPLITUDE_FULL_BLUE.svg";
import github from "../../public/Github.svg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frictionless" },
    { name: "description", content: "AI agent that watches, learns, and ships" },
  ];
}

const websiteGeneratorItems = [
  { id: "templates", title: "Templates", icon: LayoutTemplate },
  { id: "ai-generated", title: "AI Generated", icon: Sparkles },
  { id: "manual", title: "Manual", icon: PenTool },
];

const abTestingItems = [
  { id: "ab-testing", title: "A/B Testing", icon: GitCompare },
  { id: "paired-overview", title: "Paired Overview", icon: GitBranch },
  { id: "user-flows", title: "User Flows", icon: Users },
];

function AppSidebar({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) {
  const [websiteGenOpen, setWebsiteGenOpen] = useState(true);
  const [abTestingOpen, setAbTestingOpen] = useState(true);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--mypage))] flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold">Frictionless</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentView === "setup"}
                  onClick={() => onViewChange("setup")}
                >
                  <Settings className="size-4" />
                  <span>Agent Setup</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Website Generator Folder */}
              <Collapsible open={websiteGenOpen} onOpenChange={setWebsiteGenOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Globe className="size-4" />
                      <span>Website Generator</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {websiteGeneratorItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            isActive={currentView === item.id}
                            onClick={() => onViewChange(item.id)}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* A/B Testing Folder */}
              <Collapsible open={abTestingOpen} onOpenChange={setAbTestingOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <FlaskConical className="size-4" />
                      <span>A/B Testing</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {abTestingItems.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            isActive={currentView === item.id}
                            onClick={() => onViewChange(item.id)}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AgentSetupView() {
  const [amplitudeKey, setAmplitudeKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  const handleGenerate = () => {
    if (!amplitudeKey) return;
    const key = `fl_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(key);
  };

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h2 className="text-lg font-medium">Connect your services</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <img src={amplitude} alt="Amplitude" className="h-20" />
            API Key
          </label>
          <input
            type="text"
            value={amplitudeKey}
            onChange={(e) => setAmplitudeKey(e.target.value)}
            placeholder="amp_xxxxxxxx"
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mypage))] focus:border-transparent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <img src={github} alt="GitHub" className="h-20 dark:invert" />
            Access Token
            <span className="text-xs opacity-60">optional</span>
          </label>
          <input
            type="text"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxx"
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mypage))] focus:border-transparent"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!amplitudeKey}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-[hsl(var(--mypage))] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          Generate API Key
        </button>
      </div>

      {generatedKey && (
        <div className="space-y-2 pt-4 border-t">
          <label className="text-sm text-muted-foreground">Your API Key</label>
          <div className="flex gap-2">
            <code className="flex-1 px-3 py-2 text-sm bg-muted rounded-md font-mono truncate">
              {generatedKey}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(generatedKey)}
              className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DemoPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Play className="size-8 mx-auto mb-2 opacity-50" />
          <div>Demo placeholder</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("setup");

  const renderView = () => {
    switch (currentView) {
      case "setup":
        return <AgentSetupView />;
      // Website Generator views
      case "templates":
        return <DemoPlaceholder title="Templates" description="Choose from pre-built website templates" />;
      case "ai-generated":
        return <DemoPlaceholder title="AI Generated" description="Generate websites using AI" />;
      case "manual":
        return <DemoPlaceholder title="Manual" description="Build your website manually" />;
      // A/B Testing views
      case "ab-testing":
        return <DemoPlaceholder title="A/B Testing" description="Create and manage A/B tests" />;
      case "paired-overview":
        return <DemoPlaceholder title="Paired Overview" description="Compare test variants side by side" />;
      case "user-flows":
        return <DemoPlaceholder title="User Flows" description="Analyze user journey through your tests" />;
      default:
        return <AgentSetupView />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-medium">Frictionless</h1>
        </header>
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
