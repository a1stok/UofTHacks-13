import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
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
import { Settings, Zap, ChevronRight, Globe, FlaskConical, LayoutTemplate, Sparkles, PenTool, Users, GitBranch, GitCompare } from "lucide-react";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Frictionless" },
    { name: "description", content: "AI agent that watches, learns, and ships" },
  ];
}

const websiteGeneratorItems = [
  { to: "generator/templates", title: "Templates", icon: LayoutTemplate },
  { to: "generator/ai-generated", title: "AI Generated", icon: Sparkles },
  { to: "generator/manual", title: "Manual", icon: PenTool },
];

const abTestingItems = [
  { to: "experiments/ab-testing", title: "A/B Testing", icon: GitCompare },
  { to: "experiments/paired-overview", title: "Paired Overview", icon: GitBranch },
  { to: "experiments/user-flows", title: "User Flows", icon: Users },
];

function AppSidebar() {
  const [websiteGenOpen, setWebsiteGenOpen] = useState(true);
  const [abTestingOpen, setAbTestingOpen] = useState(true);
  const location = useLocation();

  const isGeneratorActive = location.pathname.includes("/dashboard/generator");
  const isExperimentsActive = location.pathname.includes("/dashboard/experiments");

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
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    end
                    className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <Settings className="size-4" />
                    <span>Agent Setup</span>
                  </NavLink>
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
              <Collapsible open={websiteGenOpen || isGeneratorActive} onOpenChange={setWebsiteGenOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isGeneratorActive ? "bg-sidebar-accent/50" : ""}>
                      <Globe className="size-4" />
                      <span>Website Generator</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {websiteGeneratorItems.map((item) => (
                        <SidebarMenuSubItem key={item.to}>
                          <SidebarMenuSubButton asChild>
                            <NavLink 
                              to={item.to}
                              className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                            >
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* A/B Testing Folder */}
              <Collapsible open={abTestingOpen || isExperimentsActive} onOpenChange={setAbTestingOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={isExperimentsActive ? "bg-sidebar-accent/50" : ""}>
                      <FlaskConical className="size-4" />
                      <span>A/B Testing</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {abTestingItems.map((item) => (
                        <SidebarMenuSubItem key={item.to}>
                          <SidebarMenuSubButton asChild>
                            <NavLink 
                              to={item.to}
                              className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                            >
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </NavLink>
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

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-medium">Frictionless</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
