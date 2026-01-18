"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

type AnimationPhase = "scanning" | "analyzing" | "diffing" | "complete";

export default function VisualDiffAnimated() {
  const [phase, setPhase] = useState<AnimationPhase>("scanning");
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const phases: AnimationPhase[] = ["scanning", "analyzing", "diffing", "complete"];
    const durations = [2000, 1500, 2500, 2000];

    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const cycle = () => {
      setPhase(phases[currentIndex]);
      if (phases[currentIndex] === "scanning") {
        setScanLine(0);
      }
      timeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        cycle();
      }, durations[currentIndex]);
    };

    cycle();

    return () => clearTimeout(timeout);
  }, []);

  // Scanning animation
  useEffect(() => {
    if (phase === "scanning") {
      const interval = setInterval(() => {
        setScanLine((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground">Visual Diff</span>
        <PhaseIndicator phase={phase} />
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mini UI Preview */}
        <div className="absolute inset-3">
          <MiniUIPreview phase={phase} scanLine={scanLine} />
        </div>

        {/* Scanning overlay */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-mypage/60"
                style={{ top: `${scanLine}%` }}
              />
              <div className="absolute inset-0 bg-mypage/5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating annotations */}
        <AnimatePresence>
          {(phase === "diffing" || phase === "complete") && (
            <>
              <FloatingAnnotation
                type="issue"
                label="High friction"
                position={{ top: "15%", left: "55%" }}
                delay={0}
              />
              <FloatingAnnotation
                type="suggestion"
                label="Low contrast"
                position={{ top: "50%", left: "20%" }}
                delay={0.2}
              />
              <FloatingAnnotation
                type="insight"
                label="Add CTA"
                position={{ top: "72%", left: "65%" }}
                delay={0.4}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with stats */}
      <div className="px-3 py-2 border-t border-border bg-muted/20">
        <AnimatePresence mode="wait">
          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="size-3 border border-mypage/50 border-t-mypage rounded-full"
              />
              <span>Scanning UI elements...</span>
            </motion.div>
          )}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-mypage"
            >
              <Sparkles className="size-3" />
              <span>Analyzing patterns...</span>
            </motion.div>
          )}
          {phase === "diffing" && (
            <motion.div
              key="diffing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-mypage"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="size-2 rounded-full bg-mypage"
              />
              <span>Generating insights...</span>
            </motion.div>
          )}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-xs text-success">
                <CheckCircle2 className="size-3" />
                <span>3 insights found</span>
              </div>
              <motion.span
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-medium text-success"
              >
                +23% CTR
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Phase indicator
function PhaseIndicator({ phase }: { phase: AnimationPhase }) {
  const phases: AnimationPhase[] = ["scanning", "analyzing", "diffing", "complete"];
  const currentIndex = phases.indexOf(phase);

  return (
    <div className="flex items-center gap-1">
      {phases.map((p, i) => (
        <motion.div
          key={p}
          animate={{
            backgroundColor:
              i < currentIndex
                ? "hsl(var(--success))"
                : i === currentIndex
                ? "hsl(var(--mypage))"
                : "hsl(var(--muted))",
            scale: i === currentIndex ? 1.2 : 1,
          }}
          className="size-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// Mini UI Preview
function MiniUIPreview({ phase, scanLine }: { phase: AnimationPhase; scanLine: number }) {
  const isAnalyzing = phase === "diffing" || phase === "complete";

  return (
    <div className="h-full rounded-md border border-border bg-background overflow-hidden text-[9px]">
      {/* Nav */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-[10px]">Acme</div>
          <div className="flex gap-1.5 text-muted-foreground">
            <span>Products</span>
            <motion.span
              animate={
                isAnalyzing
                  ? { color: ["hsl(var(--muted-foreground))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Features ▼
            </motion.span>
            <span>Pricing</span>
          </div>
        </div>
        <motion.div
          animate={
            isAnalyzing
              ? {
                  boxShadow: [
                    "0 0 0 0 hsl(var(--warning) / 0)",
                    "0 0 0 2px hsl(var(--warning) / 0.4)",
                    "0 0 0 0 hsl(var(--warning) / 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-1.5 py-0.5 rounded bg-foreground/10 text-[8px]"
        >
          Get Started
        </motion.div>
      </div>

      {/* Hero */}
      <div className="p-2 space-y-2">
        <div className="h-2.5 w-3/4 bg-muted rounded" />
        <div className="h-2 w-full bg-muted/50 rounded" />
        <div className="h-2 w-2/3 bg-muted/50 rounded" />

        <div className="flex gap-1.5 pt-1">
          <motion.div
            animate={
              isAnalyzing
                ? {
                    boxShadow: [
                      "0 0 0 0 hsl(var(--warning) / 0)",
                      "0 0 0 2px hsl(var(--warning) / 0.4)",
                      "0 0 0 0 hsl(var(--warning) / 0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="h-4 w-12 bg-muted rounded flex items-center justify-center text-[7px] text-muted-foreground"
          >
            Learn more
          </motion.div>
          <div className="h-4 w-10 bg-muted/50 rounded" />
        </div>
      </div>

      {/* Cards row */}
      <div className="px-2 pb-2">
        <div className="flex gap-1.5">
          <div className="flex-1 p-1.5 rounded bg-muted/30 border border-border/50">
            <div className="h-1.5 w-8 bg-muted rounded mb-1" />
            <div className="h-2 w-6 bg-muted/70 rounded" />
          </div>
          <motion.div
            animate={
              isAnalyzing
                ? {
                    boxShadow: [
                      "0 0 0 0 hsl(var(--mypage) / 0)",
                      "0 0 0 2px hsl(var(--mypage) / 0.3)",
                      "0 0 0 0 hsl(var(--mypage) / 0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="flex-1 p-1.5 rounded bg-muted/30 border border-border/50"
          >
            <div className="h-1.5 w-6 bg-muted rounded mb-1" />
            <div className="h-2 w-8 bg-muted/70 rounded" />
          </motion.div>
        </div>
      </div>

      {/* Features grid */}
      <div className="px-2 pb-2">
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.6 }}
              animate={
                isAnalyzing && i === 2
                  ? {
                      borderColor: [
                        "hsl(var(--border) / 0.5)",
                        "hsl(var(--success) / 0.5)",
                        "hsl(var(--border) / 0.5)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="p-1 rounded bg-muted/20 border border-border/50"
            >
              <div className="h-1 w-full bg-muted/50 rounded mb-0.5" />
              <div className="h-1 w-2/3 bg-muted/30 rounded" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Floating annotation component
function FloatingAnnotation({
  type,
  label,
  position,
  delay,
}: {
  type: "issue" | "suggestion" | "insight";
  label: string;
  position: { top: string; left: string };
  delay: number;
}) {
  const styles = {
    issue: { bg: "bg-destructive", icon: AlertCircle },
    suggestion: { bg: "bg-warning", icon: Lightbulb },
    insight: { bg: "bg-mypage", icon: Sparkles },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      style={{ top: position.top, left: position.left }}
      className="absolute"
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay + 0.5 }}
        className="flex items-center gap-1"
      >
        <div className={`size-5 rounded-full ${style.bg} flex items-center justify-center shadow-lg`}>
          <Icon className="size-2.5 text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="px-1.5 py-0.5 rounded bg-card border border-border shadow-sm text-[8px] font-medium whitespace-nowrap"
        >
          {label}
        </motion.div>
      </motion.div>
      {/* Pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        className={`absolute top-0 left-0 size-5 rounded-full ${style.bg}`}
      />
    </motion.div>
  );
}
