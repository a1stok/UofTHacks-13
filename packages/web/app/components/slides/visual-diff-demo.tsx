"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Loader2,
  Sparkles,
  X,
  ChevronRight,
  Eye,
  Code,
  Layers,
  MousePointer2,
} from "lucide-react";

// Types
type DemoPhase = "idle" | "scanning" | "diffing" | "annotating" | "complete";

interface Comment {
  id: string;
  type: "issue" | "suggestion" | "insight";
  title: string;
  description: string;
  position: { top: string; left: string };
  elementSelector: string;
}

interface Insight {
  id: string;
  icon: typeof AlertCircle;
  title: string;
  description: string;
  type: "critical" | "warning" | "opportunity";
  action: string;
}

// Comments that will appear on the UI
const uiComments: Comment[] = [
  {
    id: "c1",
    type: "issue",
    title: "High friction dropdown",
    description: "34% of users rage-click here. Consider mega menu or simplified nav.",
    position: { top: "12%", left: "45%" },
    elementSelector: "nav-dropdown",
  },
  {
    id: "c2",
    type: "suggestion",
    title: "CTA visibility low",
    description: "Button blends with background. Increase contrast and size for 23% more clicks.",
    position: { top: "58%", left: "22%" },
    elementSelector: "cta-button",
  },
  {
    id: "c3",
    type: "insight",
    title: "Interest hotspot detected",
    description: "Users hover 6.2s avg on pricing. Add comparison CTA here.",
    position: { top: "35%", left: "72%" },
    elementSelector: "pricing-card",
  },
];

// Actionable insights
const actionableInsights: Insight[] = [
  {
    id: "i1",
    icon: AlertCircle,
    title: "Fix navigation dropdown",
    description: "Replace with mega menu or flyout. Reduces bounce by 18%.",
    type: "critical",
    action: "Apply fix",
  },
  {
    id: "i2",
    icon: Lightbulb,
    title: "Enhance primary CTA",
    description: "Increase button size, add contrasting color, tooltip on hover.",
    type: "warning",
    action: "Preview",
  },
  {
    id: "i3",
    icon: Sparkles,
    title: "Add pricing comparison",
    description: "Users show high intent. Add comparison tool inline.",
    type: "opportunity",
    action: "Generate",
  },
];

export default function VisualDiffDemo() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [diffProgress, setDiffProgress] = useState(0);
  const [visibleComments, setVisibleComments] = useState<string[]>([]);
  const [visibleInsights, setVisibleInsights] = useState<string[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [showAfter, setShowAfter] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const runDemo = useCallback(() => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    setPhase("scanning");
    setScanProgress(0);
    setDiffProgress(0);
    setVisibleComments([]);
    setVisibleInsights([]);
    setActiveComment(null);
    setShowAfter(false);

    // Phase 1: Scanning (0-2s)
    let scanProg = 0;
    const scanInterval = setInterval(() => {
      scanProg += Math.random() * 8 + 4;
      if (scanProg >= 100) {
        scanProg = 100;
        clearInterval(scanInterval);
      }
      setScanProgress(scanProg);
    }, 100);

    // Phase 2: Diffing (2-4s)
    setTimeout(() => {
      setPhase("diffing");
      let diffProg = 0;
      const diffInterval = setInterval(() => {
        diffProg += Math.random() * 6 + 3;
        if (diffProg >= 100) {
          diffProg = 100;
          clearInterval(diffInterval);
        }
        setDiffProgress(diffProg);
      }, 100);
    }, 2000);

    // Phase 3: Annotating (4-7s)
    setTimeout(() => {
      setPhase("annotating");

      // Show comments one by one
      uiComments.forEach((comment, i) => {
        setTimeout(() => {
          setVisibleComments((prev) => [...prev, comment.id]);
          // Auto-expand first comment briefly
          if (i === 0) {
            setActiveComment(comment.id);
            setTimeout(() => setActiveComment(null), 1500);
          }
        }, i * 600);
      });

      // Show insights one by one
      actionableInsights.forEach((insight, i) => {
        setTimeout(() => {
          setVisibleInsights((prev) => [...prev, insight.id]);
        }, 800 + i * 500);
      });
    }, 4000);

    // Phase 4: Complete (7s+)
    setTimeout(() => {
      setPhase("complete");
      setShowAfter(true);

      // Reset after showing
      setTimeout(() => {
        setIsAutoPlaying(false);
      }, 5000);
    }, 7500);
  }, [isAutoPlaying]);

  // Start on mount
  useEffect(() => {
    const timer = setTimeout(() => runDemo(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Window header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-[#ff5f57]" />
          <div className="size-3 rounded-full bg-[#febc2e]" />
          <div className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-sm text-muted-foreground ml-2">Step 2: Visual Diff & Insights</span>
        <div className="flex-1" />

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              !showAfter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setShowAfter(true)}
            disabled={phase !== "complete"}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              showAfter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            } ${phase !== "complete" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            After
          </button>
        </div>

        <button
          onClick={runDemo}
          disabled={isAutoPlaying}
          className="px-3 py-1 text-xs rounded-md bg-mypage text-white hover:bg-mypage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAutoPlaying ? "Running..." : "Run Demo"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main visual panel */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="size-3.5" />
              <span>landing-page.tsx</span>
            </div>
            <div className="flex-1" />
            <PhaseStatus phase={phase} scanProgress={scanProgress} diffProgress={diffProgress} />
          </div>

          {/* Visual preview area */}
          <div className="flex-1 relative overflow-hidden bg-background">
            {/* Scanning overlay */}
            <AnimatePresence>
              {phase === "scanning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-b from-mypage/50 to-transparent"
                  />
                  <div className="absolute inset-0 bg-mypage/5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Diff overlay */}
            <AnimatePresence>
              {phase === "diffing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, transparent ${diffProgress}%, hsl(var(--mypage) / 0.1) ${diffProgress}%)`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The actual UI preview */}
            <div className="absolute inset-0 p-6">
              <AnimatePresence mode="wait">
                {!showAfter ? (
                  <motion.div
                    key="before"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <UIPreviewBefore phase={phase} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="after"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <UIPreviewAfter />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Floating comments */}
            {!showAfter && (
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {uiComments.map((comment) =>
                    visibleComments.includes(comment.id) ? (
                      <CommentPin
                        key={comment.id}
                        comment={comment}
                        isActive={activeComment === comment.id}
                        onHover={() => setActiveComment(comment.id)}
                        onLeave={() => setActiveComment(null)}
                      />
                    ) : null
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Insights panel */}
        <div className="w-80 border-l border-border flex flex-col bg-muted/10">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-mypage" />
              <span className="text-sm font-medium">Actionable Insights</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AI-generated recommendations based on visual diff
            </p>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {phase === "idle" || phase === "scanning" || phase === "diffing" ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                {phase === "idle" ? (
                  <>
                    <Eye className="size-8 text-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground">Waiting for analysis...</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="size-6 animate-spin text-mypage" />
                    <span className="text-sm text-muted-foreground">
                      {phase === "scanning" ? "Scanning UI elements..." : "Generating diff..."}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {actionableInsights.map((insight) =>
                    visibleInsights.includes(insight.id) ? (
                      <InsightCard key={insight.id} insight={insight} />
                    ) : null
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Summary footer */}
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border-t border-border bg-muted/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Analysis Complete</span>
                <span className="text-xs text-success flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  3 insights
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-destructive/10">
                  <div className="text-lg font-semibold text-destructive">1</div>
                  <div className="text-[10px] text-muted-foreground">Critical</div>
                </div>
                <div className="p-2 rounded bg-warning/10">
                  <div className="text-lg font-semibold text-warning">1</div>
                  <div className="text-[10px] text-muted-foreground">Warning</div>
                </div>
                <div className="p-2 rounded bg-success/10">
                  <div className="text-lg font-semibold text-success">1</div>
                  <div className="text-[10px] text-muted-foreground">Opportunity</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Phase status indicator
function PhaseStatus({
  phase,
  scanProgress,
  diffProgress,
}: {
  phase: DemoPhase;
  scanProgress: number;
  diffProgress: number;
}) {
  if (phase === "idle") {
    return <span className="text-xs text-muted-foreground">Ready</span>;
  }

  if (phase === "scanning") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-mypage rounded-full"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
        <span className="text-xs text-mypage">Scanning...</span>
      </div>
    );
  }

  if (phase === "diffing") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-mypage rounded-full"
            style={{ width: `${diffProgress}%` }}
          />
        </div>
        <span className="text-xs text-mypage">Generating diff...</span>
      </div>
    );
  }

  if (phase === "annotating") {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="size-2 rounded-full bg-mypage"
        />
        <span className="text-xs text-mypage">Adding annotations...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-success">
      <CheckCircle2 className="size-3.5" />
      <span>Complete</span>
    </div>
  );
}

// Comment pin component
function CommentPin({
  comment,
  isActive,
  onHover,
  onLeave,
}: {
  comment: Comment;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const typeStyles = {
    issue: { bg: "bg-destructive", icon: AlertCircle, color: "text-destructive" },
    suggestion: { bg: "bg-warning", icon: Lightbulb, color: "text-warning" },
    insight: { bg: "bg-mypage", icon: Sparkles, color: "text-mypage" },
  };

  const style = typeStyles[comment.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      style={{ top: comment.position.top, left: comment.position.left }}
      className="absolute pointer-events-auto"
    >
      {/* Pin marker */}
      <motion.button
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.1 }}
        className={`relative size-7 rounded-full ${style.bg} text-white flex items-center justify-center shadow-lg cursor-pointer`}
      >
        <Icon className="size-3.5" />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute inset-0 rounded-full ${style.bg}`}
        />
      </motion.button>

      {/* Expanded comment card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 z-30"
          >
            <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
              <div className={`px-3 py-2 ${style.bg}/10 border-b border-border`}>
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${style.color}`} />
                  <span className="text-sm font-medium">{comment.title}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {comment.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 px-2 py-1.5 text-xs bg-mypage text-white rounded hover:bg-mypage/90 transition-colors">
                    Apply suggestion
                  </button>
                  <button className="px-2 py-1.5 text-xs border border-border rounded hover:bg-muted transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Insight card component
function InsightCard({ insight }: { insight: Insight }) {
  const typeStyles = {
    critical: { border: "border-destructive/30", bg: "bg-destructive/5", color: "text-destructive" },
    warning: { border: "border-warning/30", bg: "bg-warning/5", color: "text-warning" },
    opportunity: { border: "border-success/30", bg: "bg-success/5", color: "text-success" },
  };

  const style = typeStyles[insight.type];
  const Icon = insight.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-3 rounded-lg border ${style.border} ${style.bg}`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`size-4 mt-0.5 ${style.color}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{insight.title}</div>
          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
          <button className="flex items-center gap-1 mt-2 text-xs text-mypage hover:underline">
            {insight.action}
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// UI Preview Before - Simulated landing page
function UIPreviewBefore({ phase }: { phase: DemoPhase }) {
  const isAnalyzing = phase === "annotating" || phase === "complete";

  return (
    <div className="h-full bg-background rounded-lg border border-border overflow-hidden text-xs">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm">Acme</span>
          <nav className="flex items-center gap-4 text-muted-foreground">
            <span>Products</span>
            <span className="relative">
              Features
              <motion.span
                animate={isAnalyzing ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -right-3 -top-1 text-[8px] text-destructive"
              >
                ▼
              </motion.span>
            </span>
            <span>Pricing</span>
            <span>Docs</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Sign in</span>
          <button className="px-3 py-1.5 rounded bg-foreground/10 text-foreground">
            Get Started
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="p-6">
        <div className="flex gap-8">
          {/* Left content */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold leading-tight">
              Build products your users will love
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              The complete platform for modern teams. Ship faster, collaborate better, and scale
              with confidence using our AI-powered tools.
            </p>
            <div className="flex gap-3 pt-2">
              <motion.button
                animate={
                  isAnalyzing
                    ? {
                        boxShadow: [
                          "0 0 0 0 hsl(var(--warning) / 0)",
                          "0 0 0 4px hsl(var(--warning) / 0.3)",
                          "0 0 0 0 hsl(var(--warning) / 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
                className="px-4 py-2 rounded bg-foreground/10 text-foreground"
              >
                Learn more
              </motion.button>
              <button className="px-4 py-2 rounded bg-foreground/5 text-muted-foreground">
                Watch demo
              </button>
            </div>
          </div>

          {/* Right - Cards */}
          <div className="w-64 space-y-3">
            <motion.div
              animate={
                isAnalyzing
                  ? {
                      boxShadow: [
                        "0 0 0 0 hsl(var(--mypage) / 0)",
                        "0 0 0 4px hsl(var(--mypage) / 0.2)",
                        "0 0 0 0 hsl(var(--mypage) / 0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="text-muted-foreground mb-1">Starter</div>
              <div className="text-xl font-semibold">$29/mo</div>
              <div className="text-muted-foreground mt-2 text-[10px]">Perfect for small teams</div>
            </motion.div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="text-muted-foreground mb-1">Pro</div>
              <div className="text-xl font-semibold">$79/mo</div>
              <div className="text-muted-foreground mt-2 text-[10px]">For growing businesses</div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { title: "Fast Setup", desc: "Get started in minutes" },
            { title: "Analytics", desc: "Track what matters" },
            { title: "Integrations", desc: "Connect your tools" },
          ].map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/50">
              <div className="font-medium mb-1">{f.title}</div>
              <div className="text-muted-foreground text-[10px]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// UI Preview After - Optimized version
function UIPreviewAfter() {
  return (
    <div className="h-full bg-background rounded-lg border border-border overflow-hidden text-xs">
      {/* Nav - Simplified */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-sm text-mypage">Acme</span>
          <nav className="flex items-center gap-4">
            <span className="text-foreground font-medium">Products</span>
            <span className="text-foreground font-medium">Pricing</span>
            <span className="text-muted-foreground">Docs</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Sign in</span>
          <motion.button
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="px-4 py-2 rounded-lg bg-mypage text-white font-medium shadow-lg shadow-mypage/20"
          >
            Start Free Trial
          </motion.button>
        </div>
      </div>

      {/* Hero - Enhanced */}
      <div className="p-6">
        <div className="flex gap-8">
          {/* Left content */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold leading-tight">
              Build products your users will love
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              The complete platform for modern teams. Ship faster, collaborate better, and scale
              with confidence.
            </p>
            <div className="flex gap-3 pt-2">
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-2.5 rounded-lg bg-mypage text-white font-medium shadow-lg shadow-mypage/20"
              >
                Get Started Free
              </motion.button>
              <button className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
                Watch demo
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-[10px] text-muted-foreground"
            >
              <CheckCircle2 className="size-3 text-success" />
              No credit card required
              <span className="mx-1">•</span>
              <CheckCircle2 className="size-3 text-success" />
              14-day free trial
            </motion.div>
          </div>

          {/* Right - Enhanced pricing comparison */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64"
          >
            <div className="p-4 rounded-lg bg-gradient-to-br from-mypage/10 to-mypage/5 border border-mypage/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Compare Plans</span>
                <span className="text-[10px] text-mypage">Popular</span>
              </div>
              <div className="space-y-2">
                {[
                  { plan: "Starter", price: "$29", features: "5 users" },
                  { plan: "Pro", price: "$79", features: "25 users", highlighted: true },
                  { plan: "Enterprise", price: "Custom", features: "Unlimited" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2 rounded ${
                      p.highlighted ? "bg-mypage/10 border border-mypage/30" : "bg-muted/30"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.plan}</div>
                      <div className="text-[10px] text-muted-foreground">{p.features}</div>
                    </div>
                    <div className="font-semibold">{p.price}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 px-3 py-2 rounded bg-mypage text-white text-[11px] font-medium">
                Compare all features
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features grid - Enhanced */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { title: "Fast Setup", desc: "Get started in minutes", icon: "⚡" },
            { title: "Analytics", desc: "Track what matters", icon: "📊" },
            { title: "Integrations", desc: "Connect your tools", icon: "🔗" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-lg bg-muted/20 border border-border/50 hover:border-mypage/30 hover:bg-mypage/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{f.icon}</span>
                <span className="font-medium group-hover:text-mypage transition-colors">{f.title}</span>
              </div>
              <div className="text-muted-foreground text-[10px]">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
