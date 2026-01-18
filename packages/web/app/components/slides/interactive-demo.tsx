"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Zap, Building2, Send, Loader2 } from "lucide-react";

// Types
type Persona = "first-time" | "power-user" | "enterprise";
type ViewTab = "ui" | "code";
type AnimationPhase = "idle" | "thinking" | "streaming" | "complete";

interface DemoState {
  persona: Persona;
  currentPrompt: string;
  isAnimating: boolean;
  phase: AnimationPhase;
  streamProgress: number; // 0-100 for smooth streaming
}

// Persona configurations
const personas: { id: Persona; label: string; icon: typeof User }[] = [
  { id: "first-time", label: "New User", icon: User },
  { id: "power-user", label: "Power User", icon: Zap },
  { id: "enterprise", label: "Enterprise", icon: Building2 },
];

// Suggested prompts per persona
const suggestedPrompts: Record<Persona, string[]> = {
  "first-time": [
    "Simplify the navigation for new users",
    "Add a welcome tooltip to guide them",
    "Make the main CTA more prominent",
  ],
  "power-user": [
    "Add keyboard shortcuts to actions",
    "Enable bulk selection mode",
    "Show a compact data view",
  ],
  "enterprise": [
    "Add team analytics dashboard",
    "Show recent activity feed",
    "Enable CSV and PDF exports",
  ],
};

// Code content for streaming
const codeContent: Record<Persona, { before: string[]; after: string[] }> = {
  "first-time": {
    before: [
      "export function Navigation() {",
      "  return (",
      '    <nav className="flex items-center gap-6">',
      "      {allMenuItems.map(item => (",
      "        <Link key={item.id} href={item.href}>",
      "          {item.label}",
      "        </Link>",
      "      ))}",
      '      <Button variant="ghost">Sign in</Button>',
      "    </nav>",
      "  );",
      "}",
    ],
    after: [
      "export function Navigation() {",
      "  const { isNewUser } = useUser();",
      "  ",
      "  return (",
      '    <nav className="flex items-center gap-4">',
      "      {/* Simplified nav for new users */}",
      "      {primaryItems.map(item => (",
      '        <Link key={item.id} href={item.href} className="flex items-center gap-2">',
      "          <item.icon className=\"size-4\" />",
      "          {item.label}",
      "        </Link>",
      "      ))}",
      "      ",
      "      <Tooltip content=\"Start your journey here\">",
      '        <Button variant="primary" size="lg" className="ml-auto">',
      "          Get Started",
      "        </Button>",
      "      </Tooltip>",
      "    </nav>",
      "  );",
      "}",
    ],
  },
  "power-user": {
    before: [
      "export function ActionBar() {",
      "  return (",
      '    <div className="flex gap-2">',
      "      {actions.map(action => (",
      "        <Button key={action.id} onClick={action.handler}>",
      "          {action.label}",
      "        </Button>",
      "      ))}",
      "    </div>",
      "  );",
      "}",
    ],
    after: [
      "export function ActionBar() {",
      "  const [selected, setSelected] = useState<string[]>([]);",
      "  ",
      "  useHotkeys('mod+a', () => selectAll());",
      "  useHotkeys('mod+e', () => bulkEdit());",
      "  ",
      "  return (",
      '    <div className="flex gap-2 items-center">',
      "      <Checkbox",
      "        checked={selected.length === items.length}",
      "        onCheckedChange={toggleAll}",
      "      />",
      "      {actions.map(action => (",
      "        <Button key={action.id} onClick={action.handler}>",
      "          {action.label}",
      '          <kbd className="ml-2 text-xs opacity-60">{action.shortcut}</kbd>',
      "        </Button>",
      "      ))}",
      '      <span className="text-xs text-muted-foreground ml-auto">',
      "        Press ? for all shortcuts",
      "      </span>",
      "    </div>",
      "  );",
      "}",
    ],
  },
  enterprise: {
    before: [
      "export function Dashboard() {",
      "  return (",
      '    <Card className="p-6">',
      "      <h2>Overview</h2>",
      "      <p>{stats.summary}</p>",
      "    </Card>",
      "  );",
      "}",
    ],
    after: [
      "export function Dashboard() {",
      "  const { data: teamStats } = useTeamAnalytics();",
      "  const { data: activity } = useRecentActivity();",
      "  ",
      "  return (",
      '    <div className="grid grid-cols-3 gap-4">',
      "      <MetricsCard",
      '        title="Team Performance"',
      "        data={teamStats}",
      "        exportFormats={['csv', 'pdf', 'xlsx']}",
      "      />",
      "      ",
      "      <ActivityFeed",
      "        items={activity}",
      "        showUserAvatars",
      "        groupByDate",
      "      />",
      "      ",
      "      <TrendChart",
      "        data={teamStats.weekly}",
      '        metric="productivity"',
      "      />",
      "    </div>",
      "  );",
      "}",
    ],
  },
};

export default function InteractiveDemo() {
  const [state, setState] = useState<DemoState>({
    persona: "first-time",
    currentPrompt: "",
    isAnimating: false,
    phase: "idle",
    streamProgress: 0,
  });
  const [activeTab, setActiveTab] = useState<ViewTab>("ui");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runAnimation = useCallback((prompt: string) => {
    if (state.isAnimating || !prompt.trim()) return;

    setState((s) => ({
      ...s,
      currentPrompt: prompt,
      isAnimating: true,
      phase: "thinking",
      streamProgress: 0,
    }));
    setInputValue("");

    // Thinking phase
    setTimeout(() => {
      setState((s) => ({ ...s, phase: "streaming" }));

      // Streaming phase with realistic variable speed
      let progress = 0;
      let lastUpdate = Date.now();
      
      const stream = () => {
        const now = Date.now();
        const elapsed = now - lastUpdate;
        lastUpdate = now;
        
        // Variable speed: faster at start and end, slower in middle (like real AI)
        // Also add some randomness for natural feel
        let speed: number;
        if (progress < 15) {
          speed = 2.5 + Math.random() * 1.5; // Fast start
        } else if (progress < 40) {
          speed = 1.5 + Math.random() * 1; // Medium
        } else if (progress < 75) {
          speed = 1 + Math.random() * 0.8; // Slower middle (thinking)
        } else {
          speed = 2 + Math.random() * 1.5; // Fast finish
        }
        
        // Occasional micro-pauses for realism
        if (Math.random() < 0.05) {
          speed = 0.2;
        }
        
        progress += speed * (elapsed / 40);
        
        if (progress >= 100) {
          progress = 100;
          setState((s) => ({ ...s, streamProgress: 100, phase: "complete" }));

          // Reset after showing complete state
          setTimeout(() => {
            setState((s) => ({
              ...s,
              isAnimating: false,
              phase: "idle",
              currentPrompt: "",
              streamProgress: 0,
            }));
          }, 3000);
        } else {
          setState((s) => ({ ...s, streamProgress: progress }));
          requestAnimationFrame(stream);
        }
      };
      
      requestAnimationFrame(stream);
    }, 1000);
  }, [state.isAnimating]);

  const selectPersona = (persona: Persona) => {
    if (state.isAnimating) return;
    setState((s) => ({ ...s, persona }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnimation(inputValue);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    runAnimation(prompt);
  };

  return (
    <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Window header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff5f57]" />
          <div className="size-3 rounded-full bg-[#febc2e]" />
          <div className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-sm text-muted-foreground ml-2">Frictionless v0</span>
        <div className="flex-1" />
        {state.isAnimating && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            {state.phase === "thinking" && (
              <>
                <Loader2 className="size-3.5 animate-spin text-mypage" />
                <span className="text-muted-foreground">Thinking...</span>
              </>
            )}
            {state.phase === "streaming" && (
              <>
                <motion.div
                  className="size-2 rounded-full bg-mypage"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <span className="text-mypage">Generating...</span>
              </>
            )}
            {state.phase === "complete" && (
              <span className="text-success">Done</span>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border flex flex-col bg-muted/20">
          {/* Persona selector */}
          <div className="p-3 border-b border-border">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              User Segment
            </div>
            <div className="flex gap-1">
              {personas.map((p) => {
                const Icon = p.icon;
                const isActive = state.persona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPersona(p.id)}
                    disabled={state.isAnimating}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-md text-xs transition-all ${
                      isActive
                        ? "bg-mypage/10 text-mypage"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${state.isAnimating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <Icon className="size-4" />
                    <span className="font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live events feed */}
          <div className="p-3 border-b border-border">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Live Events</span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-normal normal-case">streaming</span>
              </span>
            </div>
            <LiveEventsFeed persona={state.persona} />
          </div>

          {/* Impact metrics */}
          <div className="p-3 border-b border-border">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Predicted Impact
            </div>
            <div className="space-y-2">
              <MetricRow
                label="Conversion"
                before="2.4%"
                after="3.1%"
                change="+29%"
                isAnimating={state.phase === "complete"}
              />
              <MetricRow
                label="Time on Page"
                before="45s"
                after="1m 12s"
                change="+60%"
                isAnimating={state.phase === "complete"}
              />
              <MetricRow
                label="Bounce Rate"
                before="34%"
                after="21%"
                change="-38%"
                isAnimating={state.phase === "complete"}
              />
            </div>
          </div>

          {/* Suggested prompts */}
          <div className="p-3 flex-1 overflow-hidden flex flex-col">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Suggestions
            </div>
            <div className="space-y-1.5">
              {suggestedPrompts[state.persona].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={state.isAnimating}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-sm transition-all border border-transparent ${
                    state.isAnimating
                      ? "opacity-40 cursor-not-allowed text-muted-foreground"
                      : "text-foreground/80 hover:bg-muted hover:border-border cursor-pointer"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe a change..."
                disabled={state.isAnimating}
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-mypage focus:border-mypage disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={state.isAnimating || !inputValue.trim()}
                className="px-3 py-2 bg-mypage text-white rounded-md hover:bg-mypage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Main panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center px-4 border-b border-border">
            {(["ui", "code"] as ViewTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "ui" ? "Interface" : "Code"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-mypage"
                  />
                )}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground font-mono">
              {activeTab === "code" ? "components/navigation.tsx" : "Live Preview"}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "ui" ? (
                <motion.div
                  key="ui"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <UIDiffView persona={state.persona} phase={state.phase} progress={state.streamProgress} />
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <CodeStreamView persona={state.persona} phase={state.phase} progress={state.streamProgress} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric row component
function MetricRow({
  label,
  before,
  after,
  change,
  isAnimating,
}: {
  label: string;
  before: string;
  after: string;
  change: string;
  isAnimating: boolean;
}) {
  // For bounce rate, decrease (-) is good. For others, increase (+) is good.
  const isGood = label === "Bounce Rate" ? change.startsWith("-") : change.startsWith("+");
  const changeColor = isGood ? "text-success" : "text-destructive";

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`transition-opacity duration-300 ${isAnimating ? "opacity-40 line-through" : ""}`}>
          {before}
        </span>
        {isAnimating && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-medium ${changeColor}`}
          >
            → {after}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// Event templates for live feed (outside component to avoid useEffect dependency)
const liveEventTemplates: Record<Persona, { text: string; type: string }[]> = {
  "first-time": [
    { text: "click → nav_menu", type: "nav" },
    { text: "hover → pricing_btn (3.2s)", type: "engage" },
    { text: "scroll → 45% depth", type: "scroll" },
    { text: "click → signup_cta", type: "convert" },
    { text: "rage_click → nav_dropdown", type: "frustration" },
    { text: "bounce → /pricing (8s)", type: "exit" },
    { text: "hover → feature_card", type: "engage" },
    { text: "click → learn_more", type: "nav" },
    { text: "form_abandon → email_field", type: "frustration" },
    { text: "scroll → 80% depth", type: "scroll" },
  ],
  "power-user": [
    { text: "keypress → ⌘K search", type: "shortcut" },
    { text: "bulk_select → 12 items", type: "action" },
    { text: "click → export_csv", type: "action" },
    { text: "keypress → ⌘E edit", type: "shortcut" },
    { text: "api_call → /dashboard", type: "nav" },
    { text: "filter → status:active", type: "action" },
    { text: "keypress → ⌘S save", type: "shortcut" },
    { text: "sort → created_desc", type: "action" },
    { text: "click → bulk_delete", type: "action" },
    { text: "keypress → ? help", type: "shortcut" },
  ],
  "enterprise": [
    { text: "view → team_dashboard", type: "nav" },
    { text: "export → Q4_report.pdf", type: "action" },
    { text: "filter → team:engineering", type: "action" },
    { text: "click → user_activity", type: "nav" },
    { text: "download → metrics.csv", type: "action" },
    { text: "view → member_profile", type: "nav" },
    { text: "share → dashboard_link", type: "action" },
    { text: "click → date_range (30d)", type: "action" },
    { text: "hover → trend_chart", type: "engage" },
    { text: "expand → activity_feed", type: "nav" },
  ],
};

// Live events feed showing user behavior data
function LiveEventsFeed({ persona }: { persona: Persona }) {
  const [events, setEvents] = useState<{ id: number; text: string; type: string; time: string }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    // Generate initial events
    const templates = liveEventTemplates[persona];
    const initial = Array.from({ length: 4 }, (_, i) => {
      idRef.current++;
      const template = templates[Math.floor(Math.random() * templates.length)];
      return {
        id: idRef.current,
        ...template,
        time: formatTime(Date.now() - (4 - i) * 1200),
      };
    });
    setEvents(initial);

    // Add new events periodically
    const interval = setInterval(() => {
      const template = templates[Math.floor(Math.random() * templates.length)];
      idRef.current++;
      setEvents((prev) => {
        const newEvents = [
          ...prev,
          { id: idRef.current, ...template, time: formatTime(Date.now()) },
        ];
        return newEvents.slice(-5); // Keep last 5
      });
    }, 1500 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, [persona]);

  return (
    <div className="h-24 overflow-hidden font-mono text-[10px] space-y-0.5">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 py-0.5"
          >
            <span className="text-muted-foreground/50 w-10 shrink-0">{event.time}</span>
            <span className={getEventColor(event.type)}>{event.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).slice(3); // Remove hours, keep MM:SS
}

function getEventColor(type: string): string {
  switch (type) {
    case "convert":
      return "text-success";
    case "frustration":
    case "exit":
      return "text-destructive";
    case "shortcut":
    case "action":
      return "text-mypage";
    case "engage":
      return "text-foreground/70";
    default:
      return "text-muted-foreground";
  }
}

// UI Diff View with animated transitions
function UIDiffView({
  persona,
  phase,
  progress,
}: {
  persona: Persona;
  phase: AnimationPhase;
  progress: number;
}) {
  const isStreaming = phase === "streaming" || phase === "complete";
  const isComplete = phase === "complete";

  return (
    <div className="h-full flex">
      {/* Before panel */}
      <div className="flex-1 flex flex-col border-r border-border">
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">Before</span>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            animate={{
              opacity: isStreaming ? 0.4 : 1,
              scale: isStreaming ? 0.98 : 1,
              filter: isComplete ? "grayscale(0.5)" : "grayscale(0)",
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <UIPreviewBefore persona={persona} />
          </motion.div>
          
          {/* Scanning line effect */}
          {phase === "thinking" && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-0.5 bg-mypage/50 blur-[1px]"
            />
          )}
          

        </div>
      </div>

      {/* After panel */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">After</span>
          {isComplete && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-success font-medium"
            >
              Optimized
            </motion.span>
          )}
        </div>
        <div className="flex-1 relative overflow-hidden">
          {/* Placeholder/skeleton when not streaming */}
          <motion.div
            animate={{ opacity: isStreaming ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {phase === "idle" && (
              <span className="text-muted-foreground/40 text-sm">Run a prompt to see changes</span>
            )}
            {phase === "thinking" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Analyzing interface...</span>
              </div>
            )}
          </motion.div>

          {/* Streaming after view */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isStreaming ? 1 : 0 }}
            className="absolute inset-0"
          >
            <UIPreviewAfter persona={persona} progress={progress} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Code streaming view
function CodeStreamView({
  persona,
  phase,
  progress,
}: {
  persona: Persona;
  phase: AnimationPhase;
  progress: number;
}) {
  const content = codeContent[persona];
  const totalAfterChars = content.after.join("\n").length;
  const visibleChars = Math.floor((progress / 100) * totalAfterChars);

  // Calculate which lines and how much of each line to show
  const getVisibleContent = () => {
    let charCount = 0;
    const lines: { text: string; complete: boolean }[] = [];

    for (const line of content.after) {
      if (charCount >= visibleChars) break;

      const remainingChars = visibleChars - charCount;
      if (remainingChars >= line.length) {
        lines.push({ text: line, complete: true });
        charCount += line.length + 1; // +1 for newline
      } else {
        lines.push({ text: line.slice(0, remainingChars), complete: false });
        break;
      }
    }

    return lines;
  };

  const visibleLines = phase === "streaming" || phase === "complete" ? getVisibleContent() : [];
  const isComplete = phase === "complete";

  return (
    <div className="h-full flex font-mono text-[13px] leading-relaxed">
      {/* Before code */}
      <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground">Before</span>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <motion.div
            animate={{
              opacity: phase === "streaming" || phase === "complete" ? 0.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {content.before.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                <code className={`${phase !== "idle" && phase !== "thinking" ? "text-destructive/60" : "text-foreground/80"}`}>
                  {line}
                </code>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* After code */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">After</span>
          {isComplete && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-success"
            >
              {content.after.length} lines
            </motion.span>
          )}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {phase === "idle" && (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm">
              Run a prompt to see code changes
            </div>
          )}

          {phase === "thinking" && (
            <div className="h-full flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground text-sm"
              >
                Analyzing code...
              </motion.div>
            </div>
          )}

          {(phase === "streaming" || phase === "complete") && (
            <div>
              {isComplete ? (
                // Show all lines when complete
                content.after.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.15 }}
                    className="flex"
                  >
                    <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                    <code className="text-success/90">{line}</code>
                  </motion.div>
                ))
              ) : (
                // Streaming lines
                <>
                  {visibleLines.map((lineData, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-right pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                      <code className="text-success/90">
                        {lineData.text}
                        {!lineData.complete && i === visibleLines.length - 1 && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-[2px] h-[1.1em] bg-mypage ml-px align-text-bottom"
                          />
                        )}
                      </code>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// UI Preview components - Before state with real content
function UIPreviewBefore({ persona }: { persona: Persona }) {
  if (persona === "first-time") return <UIBeforeFirstTime />;
  if (persona === "power-user") return <UIBeforePowerUser />;
  return <UIBeforeEnterprise />;
}

function UIBeforeFirstTime() {
  return (
    <div className="h-full bg-background p-5 text-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
        <div className="flex items-center gap-5">
          <span className="font-semibold text-foreground">Acme</span>
          <nav className="flex gap-4 text-muted-foreground">
            <span>Home</span>
            <span>Products</span>
            <span>Pricing</span>
            <span>Docs</span>
            <span>Blog</span>
            <span>About</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Sign in</span>
          <button className="px-3 py-1.5 rounded-md bg-foreground/10 text-foreground text-xs">
            Get Started
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-3">Build better products</h1>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The complete platform for modern teams. Ship faster, collaborate better, and scale with confidence.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-md bg-foreground/10 text-xs">Learn more</button>
            <button className="px-4 py-2 rounded-md bg-foreground/5 text-xs text-muted-foreground">Watch demo</button>
          </div>
        </div>
        <div className="w-48 h-32 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground text-xs">
          Product preview
        </div>
      </div>
    </div>
  );
}

function UIBeforePowerUser() {
  const items = [
    { name: "Q4 Marketing Campaign", status: "In Progress", date: "Dec 15" },
    { name: "Website Redesign", status: "Review", date: "Dec 12" },
    { name: "API Documentation", status: "In Progress", date: "Dec 10" },
    { name: "Mobile App v2.0", status: "Planning", date: "Dec 8" },
  ];
  return (
    <div className="h-full bg-background p-4 text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Projects</span>
          <nav className="flex gap-3 text-muted-foreground">
            <span>All</span>
            <span>Active</span>
            <span>Archived</span>
          </nav>
        </div>
        <button className="px-2 py-1 rounded bg-foreground/10 text-[10px]">+ New</button>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-2 rounded hover:bg-muted/50">
            <span className="flex-1 font-medium">{item.name}</span>
            <span className="text-muted-foreground px-2 py-0.5 rounded bg-muted">{item.status}</span>
            <span className="text-muted-foreground w-14">{item.date}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <button className="px-3 py-1.5 rounded bg-foreground/10">Edit</button>
        <button className="px-3 py-1.5 rounded bg-foreground/5 text-muted-foreground">Delete</button>
      </div>
    </div>
  );
}

function UIBeforeEnterprise() {
  return (
    <div className="h-full bg-background p-4 text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <span className="font-semibold">Dashboard</span>
        <span className="text-muted-foreground">Last 30 days</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-muted-foreground mb-1">Total Users</div>
          <div className="text-xl font-semibold">2,847</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="text-muted-foreground mb-1">Revenue</div>
          <div className="text-xl font-semibold">$127.4k</div>
        </div>
      </div>
      <div className="p-3 rounded-lg bg-muted/30">
        <div className="text-muted-foreground mb-2">Overview</div>
        <p className="text-muted-foreground leading-relaxed">
          Performance metrics for Q4. Growth trending upward across all segments.
        </p>
      </div>
    </div>
  );
}

function UIPreviewAfter({ persona, progress }: { persona: Persona; progress: number }) {
  if (persona === "first-time") return <UIAfterFirstTime progress={progress} />;
  if (persona === "power-user") return <UIAfterPowerUser progress={progress} />;
  return <UIAfterEnterprise progress={progress} />;
}

function UIAfterFirstTime({ progress }: { progress: number }) {
  const s1 = progress > 15;
  const s2 = progress > 45;
  const s3 = progress > 75;

  return (
    <div className="h-full bg-background p-5 text-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
        <div className="flex items-center gap-5">
          <motion.span
            initial={{ opacity: 0 }}
            animate={s1 ? { opacity: 1 } : {}}
            className="font-semibold text-mypage"
          >
            Acme
          </motion.span>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={s1 ? { opacity: 1 } : {}}
            className="flex gap-4"
          >
            {["Home", "Features", "Pricing"].map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: -5 }}
                animate={s1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05 }}
                className="text-foreground/80 font-medium"
              >
                {item}
              </motion.span>
            ))}
          </motion.nav>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={s2 ? { opacity: 1, scale: 1 } : {}}
          className="relative"
        >
          <button className="px-4 py-2 rounded-lg bg-mypage text-white font-medium text-xs">
            Get Started Free
          </button>
          {s3 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 right-0 bg-foreground text-background text-[10px] px-2 py-1 rounded whitespace-nowrap"
            >
              No credit card required
            </motion.div>
          )}
        </motion.div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={s1 ? { opacity: 1 } : {}}
            className="text-2xl font-semibold mb-3"
          >
            Build better products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={s2 ? { opacity: 1 } : {}}
            className="text-muted-foreground mb-4 leading-relaxed"
          >
            The complete platform for modern teams.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={s3 ? { opacity: 1, y: 0 } : {}}
            className="flex gap-2"
          >
            <button className="px-5 py-2.5 rounded-lg bg-mypage text-white text-xs font-medium">
              Start free trial
            </button>
            <button className="px-4 py-2 rounded-lg border border-border text-xs">
              Watch demo
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={s2 ? { opacity: 1, x: 0 } : {}}
          className="w-48 h-32 rounded-lg bg-gradient-to-br from-mypage/20 to-mypage/5 border border-mypage/20 flex items-center justify-center"
        >
          <span className="text-mypage text-xs font-medium">Interactive Demo</span>
        </motion.div>
      </div>
    </div>
  );
}

function UIAfterPowerUser({ progress }: { progress: number }) {
  const s1 = progress > 10;
  const s2 = progress > 30;
  const s3 = progress > 55;
  const s4 = progress > 80;

  const items = [
    { name: "Q4 Marketing Campaign", status: "In Progress", date: "Dec 15", key: "1" },
    { name: "Website Redesign", status: "Review", date: "Dec 12", key: "2" },
    { name: "API Documentation", status: "In Progress", date: "Dec 10", key: "3" },
    { name: "Mobile App v2.0", status: "Planning", date: "Dec 8", key: "4" },
  ];

  return (
    <div className="h-full bg-background p-4 text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Projects</span>
          <nav className="flex gap-3 text-muted-foreground">
            <span>All</span>
            <span>Active</span>
            <span>Archived</span>
          </nav>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={s1 ? { opacity: 1 } : {}}
          className="flex items-center gap-2"
        >
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">⌘K</kbd>
          <span className="text-muted-foreground">Search</span>
        </motion.div>
      </div>

      <div className="space-y-0.5">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 1 }}
            animate={s2 ? { opacity: 1 } : {}}
            className="flex items-center gap-2 py-2 px-2 rounded hover:bg-muted/50 group"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={s2 ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.03 }}
            >
              <input type="checkbox" className="size-3.5 rounded" />
            </motion.div>
            <span className="flex-1 font-medium">{item.name}</span>
            <span className="text-muted-foreground px-2 py-0.5 rounded bg-muted text-[10px]">{item.status}</span>
            <span className="text-muted-foreground w-12">{item.date}</span>
            <motion.kbd
              initial={{ opacity: 0 }}
              animate={s3 ? { opacity: 1 } : {}}
              className="px-1 py-0.5 rounded bg-muted/50 text-muted-foreground text-[9px] opacity-0 group-hover:opacity-100"
            >
              ⌘{i + 1}
            </motion.kbd>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={s3 ? { opacity: 1, y: 0 } : {}}
        className="flex gap-2 mt-3 pt-3 border-t border-border"
      >
        <button className="px-3 py-1.5 rounded bg-foreground/10 flex items-center gap-1.5">
          Bulk Edit <kbd className="text-[9px] opacity-50">⌘E</kbd>
        </button>
        <button className="px-3 py-1.5 rounded bg-foreground/10 flex items-center gap-1.5">
          Export <kbd className="text-[9px] opacity-50">⌘⇧E</kbd>
        </button>
        <button className="px-3 py-1.5 rounded bg-foreground/5 text-muted-foreground flex items-center gap-1.5">
          Archive <kbd className="text-[9px] opacity-50">⌘⌫</kbd>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={s4 ? { opacity: 1 } : {}}
        className="mt-2 text-[10px] text-muted-foreground"
      >
        <kbd className="px-1 rounded bg-muted">?</kbd> for all shortcuts · <kbd className="px-1 rounded bg-muted">⌘A</kbd> select all
      </motion.div>
    </div>
  );
}

function UIAfterEnterprise({ progress }: { progress: number }) {
  const s1 = progress > 10;
  const s2 = progress > 30;
  const s3 = progress > 55;
  const s4 = progress > 80;

  return (
    <div className="h-full bg-background p-4 text-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <span className="font-semibold">Team Dashboard</span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={s1 ? { opacity: 1 } : {}}
          className="flex gap-1"
        >
          {["CSV", "PDF", "XLSX"].map((f, i) => (
            <motion.button
              key={f}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={s1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              className="px-2 py-1 rounded bg-muted text-[10px]"
            >
              {f}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={s2 ? { opacity: 1 } : {}}
        className="grid grid-cols-3 gap-2 mb-3"
      >
        {[
          { label: "Active Users", value: "2,847", change: "+12%" },
          { label: "Revenue", value: "$127.4k", change: "+8%" },
          { label: "Growth", value: "+23.5%", change: "+5%" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 5 }}
            animate={s2 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.05 }}
            className="p-2 rounded-lg bg-muted/30"
          >
            <div className="text-muted-foreground text-[10px]">{m.label}</div>
            <div className="font-semibold">{m.value}</div>
            <div className="text-success text-[10px]">{m.change}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={s3 ? { opacity: 1 } : {}}
          className="flex-1 p-2 rounded-lg bg-muted/20"
        >
          <div className="text-[10px] text-muted-foreground mb-1">Weekly Trend</div>
          <div className="h-16 flex items-end gap-1">
            {[35, 50, 45, 70, 60, 80, 75].map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={s3 ? { height: `${v}%` } : {}}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex-1 bg-mypage/60 rounded-t"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={s4 ? { opacity: 1, x: 0 } : {}}
          className="w-32 p-2 rounded-lg bg-muted/20"
        >
          <div className="text-[10px] text-muted-foreground mb-1">Activity</div>
          <div className="space-y-1">
            {["Sarah: Q4 report", "John: +3 users", "Sync complete"].map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={s4 ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.08 }}
                className="text-[10px] text-muted-foreground truncate"
              >
                {a}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


