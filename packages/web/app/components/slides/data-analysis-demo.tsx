"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MousePointer2,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Eye,
  Target,
  Zap,
} from "lucide-react";

// Types
type AnalysisPhase = "collecting" | "processing" | "analyzing" | "generating" | "complete";

interface DataPoint {
  id: number;
  type: "click" | "hover" | "scroll" | "rage" | "abandon" | "time";
  element: string;
  value: string;
  timestamp: number;
  severity?: "low" | "medium" | "high";
}

interface Pattern {
  id: string;
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  severity: "warning" | "critical" | "info";
  metrics: { label: string; value: string }[];
}

interface Feedback {
  id: string;
  type: "issue" | "opportunity" | "recommendation";
  title: string;
  description: string;
  impact: string;
  priority: "high" | "medium" | "low";
}

// Sample raw data events
const rawDataEvents: Omit<DataPoint, "id" | "timestamp">[] = [
  { type: "click", element: "nav.pricing", value: "1 click", severity: "low" },
  { type: "hover", element: "btn.signup", value: "4.2s hover", severity: "medium" },
  { type: "scroll", element: "section.features", value: "34% depth", severity: "low" },
  { type: "rage", element: "dropdown.menu", value: "5 clicks/2s", severity: "high" },
  { type: "abandon", element: "form.checkout", value: "field 3/5", severity: "high" },
  { type: "time", element: "page.landing", value: "12s stay", severity: "low" },
  { type: "click", element: "btn.demo", value: "3 clicks", severity: "low" },
  { type: "hover", element: "card.pricing", value: "8.1s hover", severity: "medium" },
  { type: "scroll", element: "page.main", value: "78% depth", severity: "low" },
  { type: "rage", element: "input.search", value: "rapid delete", severity: "high" },
  { type: "abandon", element: "modal.signup", value: "closed @ 2s", severity: "medium" },
  { type: "time", element: "section.docs", value: "45s read", severity: "low" },
];

// Detected patterns
const detectedPatterns: Pattern[] = [
  {
    id: "p1",
    icon: AlertTriangle,
    title: "High Friction Zone",
    description: "Dropdown menu causing frustration",
    severity: "critical",
    metrics: [
      { label: "Rage clicks", value: "34%" },
      { label: "Bounce rate", value: "+18%" },
    ],
  },
  {
    id: "p2",
    icon: Clock,
    title: "Form Abandonment",
    description: "Users drop off at checkout field 3",
    severity: "warning",
    metrics: [
      { label: "Drop-off", value: "67%" },
      { label: "Avg. time", value: "8s" },
    ],
  },
  {
    id: "p3",
    icon: Eye,
    title: "Interest Signal",
    description: "Extended hover on pricing cards",
    severity: "info",
    metrics: [
      { label: "Avg. hover", value: "6.2s" },
      { label: "Click rate", value: "12%" },
    ],
  },
];

// Generated feedback
const generatedFeedback: Feedback[] = [
  {
    id: "f1",
    type: "issue",
    title: "Fix dropdown navigation",
    description: "Replace multi-level dropdown with mega menu or simplified navigation structure",
    impact: "Reduce bounce rate by ~18%",
    priority: "high",
  },
  {
    id: "f2",
    type: "issue",
    title: "Simplify checkout form",
    description: "Split field 3 into smaller steps or add auto-fill support",
    impact: "Recover 67% of abandonments",
    priority: "high",
  },
  {
    id: "f3",
    type: "opportunity",
    title: "Add pricing comparison CTA",
    description: "Users show high interest in pricing. Add comparison tool or contact sales prompt",
    impact: "Increase conversions by ~23%",
    priority: "medium",
  },
];

export default function DataAnalysisDemo() {
  const [phase, setPhase] = useState<AnalysisPhase>("collecting");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [visiblePatterns, setVisiblePatterns] = useState<string[]>([]);
  const [visibleFeedback, setVisibleFeedback] = useState<string[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const idRef = useRef(0);

  // Auto-play the demo
  const runDemo = useCallback(() => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    setPhase("collecting");
    setDataPoints([]);
    setProcessedCount(0);
    setVisiblePatterns([]);
    setVisibleFeedback([]);

    // Phase 1: Collecting data (0-3s)
    const collectionInterval = setInterval(() => {
      const template = rawDataEvents[Math.floor(Math.random() * rawDataEvents.length)];
      idRef.current++;
      setDataPoints((prev) => {
        const newPoints = [
          ...prev,
          { ...template, id: idRef.current, timestamp: Date.now() },
        ];
        return newPoints.slice(-12);
      });
    }, 250);

    // Phase 2: Processing (3-5s)
    setTimeout(() => {
      clearInterval(collectionInterval);
      setPhase("processing");

      let count = 0;
      const processInterval = setInterval(() => {
        count += Math.floor(Math.random() * 15) + 10;
        if (count >= 100) {
          count = 100;
          clearInterval(processInterval);
        }
        setProcessedCount(count);
      }, 150);
    }, 3000);

    // Phase 3: Analyzing (5-7s)
    setTimeout(() => {
      setPhase("analyzing");
      
      // Reveal patterns one by one
      detectedPatterns.forEach((pattern, i) => {
        setTimeout(() => {
          setVisiblePatterns((prev) => [...prev, pattern.id]);
        }, i * 500);
      });
    }, 5000);

    // Phase 4: Generating feedback (7-9s)
    setTimeout(() => {
      setPhase("generating");
      
      // Reveal feedback one by one
      generatedFeedback.forEach((fb, i) => {
        setTimeout(() => {
          setVisibleFeedback((prev) => [...prev, fb.id]);
        }, i * 600);
      });
    }, 7000);

    // Phase 5: Complete (9s+)
    setTimeout(() => {
      setPhase("complete");
      
      // Reset after showing complete state
      setTimeout(() => {
        setIsAutoPlaying(false);
      }, 4000);
    }, 9500);
  }, [isAutoPlaying]);

  // Start demo on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      runDemo();
    }, 500);
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
        <span className="text-sm text-muted-foreground ml-2">Step 1: Data Analysis</span>
        <div className="flex-1" />
        <PhaseIndicator phase={phase} />
        <button
          onClick={runDemo}
          disabled={isAutoPlaying}
          className="px-3 py-1 text-xs rounded-md bg-mypage text-white hover:bg-mypage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAutoPlaying ? "Running..." : "Run Demo"}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Raw Data Stream */}
        <div className="w-72 border-r border-border flex flex-col bg-muted/10">
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Raw Behavior Data
              </div>
              <span className="flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: phase === "collecting" ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.6, repeat: phase === "collecting" ? Infinity : 0 }}
                  className={`size-1.5 rounded-full ${phase === "collecting" ? "bg-success" : "bg-muted-foreground/30"}`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {phase === "collecting" ? "streaming" : "paused"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-3">
            <div className="space-y-1 font-mono text-[10px]">
              <AnimatePresence initial={false}>
                {dataPoints.map((point) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 py-1 px-2 rounded bg-background/50"
                  >
                    <DataTypeIcon type={point.type} />
                    <span className="flex-1 truncate text-foreground/80">{point.element}</span>
                    <span className={`${getSeverityColor(point.severity)}`}>{point.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Processing indicator */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground">Processing</span>
              <span className="text-[10px] font-mono text-mypage">{processedCount}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-mypage rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${processedCount}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Middle panel - Pattern Detection */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Pattern Detection
              </div>
              {phase !== "collecting" && phase !== "processing" && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-mypage"
                >
                  {visiblePatterns.length} patterns found
                </motion.span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {(phase === "collecting" || phase === "processing") && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <BarChart3 className="size-8 text-muted-foreground/30" />
                </motion.div>
                <span className="text-sm">
                  {phase === "collecting" ? "Collecting behavior data..." : "Processing events..."}
                </span>
              </div>
            )}

            {(phase === "analyzing" || phase === "generating" || phase === "complete") && (
              <div className="space-y-3">
                <AnimatePresence>
                  {detectedPatterns.map((pattern) => (
                    <PatternCard
                      key={pattern.id}
                      pattern={pattern}
                      isVisible={visiblePatterns.includes(pattern.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Analysis summary */}
          <div className="p-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Critical: 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">Warning: 1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-mypage" />
                <span className="text-muted-foreground">Info: 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Generated Feedback */}
        <div className="w-80 flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-mypage" />
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  AI Feedback
                </span>
              </div>
              {phase === "complete" && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] text-success flex items-center gap-1"
                >
                  <CheckCircle2 className="size-3" />
                  Generated
                </motion.span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {(phase === "collecting" || phase === "processing" || phase === "analyzing") && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                {phase === "analyzing" ? (
                  <>
                    <Loader2 className="size-6 animate-spin text-mypage" />
                    <span className="text-sm">Analyzing patterns...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-8 text-muted-foreground/30" />
                    <span className="text-sm">Waiting for analysis...</span>
                  </>
                )}
              </div>
            )}

            {(phase === "generating" || phase === "complete") && (
              <div className="space-y-3">
                <AnimatePresence>
                  {generatedFeedback.map((feedback) => (
                    <FeedbackCard
                      key={feedback.id}
                      feedback={feedback}
                      isVisible={visibleFeedback.includes(feedback.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Impact summary */}
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border-t border-border bg-success/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Projected Impact</span>
                <span className="text-xs font-medium text-success">+31% conversion</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Phase indicator component
function PhaseIndicator({ phase }: { phase: AnalysisPhase }) {
  const phases: { id: AnalysisPhase; label: string }[] = [
    { id: "collecting", label: "Collect" },
    { id: "processing", label: "Process" },
    { id: "analyzing", label: "Analyze" },
    { id: "generating", label: "Generate" },
    { id: "complete", label: "Done" },
  ];

  const currentIndex = phases.findIndex((p) => p.id === phase);

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => {
        const isActive = p.id === phase;
        const isComplete = i < currentIndex;
        return (
          <div key={p.id} className="flex items-center gap-1">
            <motion.div
              animate={{
                backgroundColor: isComplete
                  ? "hsl(var(--success))"
                  : isActive
                  ? "hsl(var(--mypage))"
                  : "hsl(var(--muted))",
                scale: isActive ? 1.1 : 1,
              }}
              className={`size-1.5 rounded-full`}
            />
            {i < phases.length - 1 && (
              <div
                className={`w-3 h-px ${isComplete ? "bg-success" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-[10px] text-muted-foreground">
        {phases.find((p) => p.id === phase)?.label}
      </span>
    </div>
  );
}

// Data type icon
function DataTypeIcon({ type }: { type: DataPoint["type"] }) {
  const iconClass = "size-3";
  switch (type) {
    case "click":
      return <MousePointer2 className={`${iconClass} text-mypage`} />;
    case "hover":
      return <Eye className={`${iconClass} text-foreground/60`} />;
    case "scroll":
      return <TrendingUp className={`${iconClass} text-foreground/60`} />;
    case "rage":
      return <AlertTriangle className={`${iconClass} text-destructive`} />;
    case "abandon":
      return <TrendingDown className={`${iconClass} text-warning`} />;
    case "time":
      return <Clock className={`${iconClass} text-foreground/60`} />;
    default:
      return <Target className={`${iconClass} text-muted-foreground`} />;
  }
}

// Severity color helper
function getSeverityColor(severity?: string): string {
  switch (severity) {
    case "high":
      return "text-destructive";
    case "medium":
      return "text-warning";
    default:
      return "text-muted-foreground";
  }
}

// Pattern card component
function PatternCard({ pattern, isVisible }: { pattern: Pattern; isVisible: boolean }) {
  if (!isVisible) return null;

  const Icon = pattern.icon;
  const severityStyles = {
    critical: "border-destructive/30 bg-destructive/5",
    warning: "border-warning/30 bg-warning/5",
    info: "border-mypage/30 bg-mypage/5",
  };
  const iconStyles = {
    critical: "text-destructive",
    warning: "text-warning",
    info: "text-mypage",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg border ${severityStyles[pattern.severity]}`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`size-4 mt-0.5 ${iconStyles[pattern.severity]}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground">{pattern.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{pattern.description}</div>
          <div className="flex gap-3 mt-2">
            {pattern.metrics.map((m) => (
              <div key={m.label} className="text-[10px]">
                <span className="text-muted-foreground">{m.label}: </span>
                <span className="font-medium text-foreground">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Feedback card component
function FeedbackCard({ feedback, isVisible }: { feedback: Feedback; isVisible: boolean }) {
  if (!isVisible) return null;

  const typeStyles = {
    issue: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5" },
    opportunity: { icon: TrendingUp, color: "text-success", bg: "bg-success/5" },
    recommendation: { icon: Zap, color: "text-mypage", bg: "bg-mypage/5" },
  };
  const priorityStyles = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-warning/10 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  const style = typeStyles[feedback.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg border border-border ${style.bg}`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`size-4 mt-0.5 ${style.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{feedback.title}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${priorityStyles[feedback.priority]}`}>
              {feedback.priority}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{feedback.description}</div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px]">
            <ArrowRight className="size-3 text-success" />
            <span className="text-success font-medium">{feedback.impact}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
