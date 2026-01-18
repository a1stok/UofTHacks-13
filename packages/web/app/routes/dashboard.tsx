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
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Card, CardContent } from "~/components/ui/card";
import { Settings, Play, Zap, Eye, GitCompare, MousePointer } from "lucide-react";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frictionless" },
    { name: "description", content: "AI agent that watches, learns, and ships" },
  ];
}

const menuItems = [
  { id: "setup", title: "Agent Setup", icon: Settings },
  { id: "demo-live", title: "Live Events", icon: Zap },
  { id: "demo-diff", title: "Visual Diff", icon: Eye },
  { id: "demo-ab", title: "A/B Compare", icon: GitCompare },
  { id: "demo-clicks", title: "Click Analysis", icon: MousePointer },
];

function AppSidebar({ currentView, onViewChange }: { currentView: string; onViewChange: (view: string) => void }) {
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
          <SidebarGroupLabel>Demos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(1).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AgentSetupView() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold">Agent Setup</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Configure the AI agent for your website
        </p>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            Connect your analytics and let the agent learn from user behavior.
          </div>
        </CardContent>
      </Card>
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
      case "demo-live":
        return <DemoPlaceholder title="Live Events" description="Watch real-time user interactions" />;
      case "demo-diff":
        return <DemoPlaceholder title="Visual Diff" description="See AI-suggested UI improvements" />;
      case "demo-ab":
        return <DemoPlaceholder title="A/B Compare" description="Compare original vs optimized versions" />;
      case "demo-clicks":
        return <DemoPlaceholder title="Click Analysis" description="Analyze click patterns and friction points" />;
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
