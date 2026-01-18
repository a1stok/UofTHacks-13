"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  CheckCircle2,
  MessageSquare,
  GitBranch,
  Play,
  BarChart3,
  TrendingUp,
  Clock,
  Send,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Percent,
  Eye,
  MousePointer2,
  Loader2,
  Check,
  X,
} from "lucide-react";

// Types
type DemoPhase = "idle" | "sharing" | "reviewing" | "voting" | "testing" | "results" | "complete";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface ReviewComment {
  id: string;
  author: TeamMember;
  text: string;
  timestamp: string;
  type: "approve" | "comment" | "request";
}

interface ABTestResult {
  variant: "A" | "B";
  label: string;
  visitors: number;
  conversions: number;
  rate: string;
  improvement?: string;
  isWinner?: boolean;
}

// Team members
const teamMembers: TeamMember[] = [
  { id: "t1", name: "Sarah Chen", avatar: "SC", role: "Design Lead" },
  { id: "t2", name: "Alex Rivera", avatar: "AR", role: "Frontend Dev" },
  { id: "t3", name: "Jordan Park", avatar: "JP", role: "Product Manager" },
  { id: "t4", name: "Sam Taylor", avatar: "ST", role: "UX Researcher" },
];

// Review comments
const reviewComments: ReviewComment[] = [
  {
    id: "r1",
    author: teamMembers[0],
    text: "Love the simplified nav. The mega menu approach is much cleaner.",
    timestamp: "2m ago",
    type: "approve",
  },
  {
    id: "r2",
    author: teamMembers[1],
    text: "CTA contrast looks great. Should we also update the mobile version?",
    timestamp: "1m ago",
    type: "comment",
  },
  {
    id: "r3",
    author: teamMembers[2],
    text: "Can we add a tooltip explaining the pricing comparison?",
    timestamp: "30s ago",
    type: "request",
  },
];

// A/B test results
const abTestResults: ABTestResult[] = [
  {
    variant: "A",
    label: "Original",
    visitors: 12847,
    conversions: 308,
    rate: "2.4%",
  },
  {
    variant: "B",
    label: "AI Optimized",
    visitors: 12912,
    conversions: 491,
    rate: "3.8%",
    improvement: "+58%",
    isWinner: true,
  },
];

export default function TeamReviewDemo() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [visibleComments, setVisibleComments] = useState<string[]>([]);
  const [votes, setVotes] = useState<{ approve: number; reject: number }>({ approve: 0, reject: 0 });
  const [testProgress, setTestProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const runDemo = useCallback(() => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    setPhase("sharing");
    setSharedWith([]);
    setVisibleComments([]);
    setVotes({ approve: 0, reject: 0 });
    setTestProgress(0);
    setShowResults(false);

    // Phase 1: Sharing (0-2s) - Team members receive the proposal
    teamMembers.forEach((member, i) => {
      setTimeout(() => {
        setSharedWith((prev) => [...prev, member.id]);
      }, 300 + i * 400);
    });

    // Phase 2: Reviewing (2-5s) - Comments come in
    setTimeout(() => {
      setPhase("reviewing");
      reviewComments.forEach((comment, i) => {
        setTimeout(() => {
          setVisibleComments((prev) => [...prev, comment.id]);
        }, i * 800);
      });
    }, 2000);

    // Phase 3: Voting (5-7s) - Team votes
    setTimeout(() => {
      setPhase("voting");
      // Simulate votes coming in
      setTimeout(() => setVotes({ approve: 1, reject: 0 }), 300);
      setTimeout(() => setVotes({ approve: 2, reject: 0 }), 700);
      setTimeout(() => setVotes({ approve: 3, reject: 0 }), 1100);
      setTimeout(() => setVotes({ approve: 3, reject: 1 }), 1500);
    }, 5000);

    // Phase 4: A/B Testing (7-11s) - Test runs
    setTimeout(() => {
      setPhase("testing");
      let progress = 0;
      const testInterval = setInterval(() => {
        progress += Math.random() * 4 + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(testInterval);
        }
        setTestProgress(progress);
      }, 100);
    }, 7000);

    // Phase 5: Results (11-13s)
    setTimeout(() => {
      setPhase("results");
      setShowResults(true);
    }, 11000);

    // Phase 6: Complete
    setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        setIsAutoPlaying(false);
      }, 4000);
    }, 13000);
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
        <span className="text-sm text-muted-foreground ml-2">Step 3: Team Review & A/B Testing</span>
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
        {/* Left panel - Team & Review */}
        <div className="w-80 border-r border-border flex flex-col bg-muted/10">
          {/* Share with team section */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-mypage" />
                <span className="text-sm font-medium">Share with Team</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {sharedWith.length}/{teamMembers.length} notified
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member) => (
                <TeamMemberBadge
                  key={member.id}
                  member={member}
                  isShared={sharedWith.includes(member.id)}
                />
              ))}
            </div>
          </div>

          {/* Review comments */}
          <div className="flex-1 overflow-auto p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Review Comments
              </span>
              <span className="text-[10px] text-muted-foreground">
                {visibleComments.length} comments
              </span>
            </div>

            {phase === "idle" || phase === "sharing" ? (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
                <MessageSquare className="size-6 text-muted-foreground/30 mb-2" />
                <span className="text-xs">Waiting for team feedback...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {reviewComments.map((comment) =>
                    visibleComments.includes(comment.id) ? (
                      <CommentCard key={comment.id} comment={comment} />
                    ) : null
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Voting section */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Team Approval</span>
              <span className="text-[10px] text-muted-foreground">
                {votes.approve + votes.reject}/4 voted
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="size-4 text-success" />
                  <span className="text-lg font-semibold text-success">{votes.approve}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Approve</span>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="size-4 text-destructive" />
                  <span className="text-lg font-semibold text-destructive">{votes.reject}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Request Changes</span>
              </div>
            </div>
            {votes.approve >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-1.5 text-xs text-success"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Approved for A/B testing</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Center panel - Preview & Actions */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs">
              <GitBranch className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">experiment/</span>
              <span className="text-foreground font-medium">nav-optimization-v2</span>
            </div>
            <div className="flex-1" />
            {phase === "testing" || phase === "results" || phase === "complete" ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-success/10 text-success text-xs">
                  <Play className="size-3" />
                  <span>A/B Test {phase === "testing" ? "Running" : "Complete"}</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Main preview area */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="h-full flex gap-4">
              {/* Variant A */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Variant A (Control)</span>
                  {showResults && (
                    <span className="text-[10px] text-muted-foreground">2.4% conversion</span>
                  )}
                </div>
                <div className="flex-1 rounded-lg border border-border bg-background overflow-hidden relative">
                  <VariantPreview variant="A" />
                  {showResults && !abTestResults[0].isWinner && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-background/60 flex items-center justify-center"
                    >
                      <span className="text-sm text-muted-foreground">Control</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-px h-16 bg-border" />
                <span className="text-xs text-muted-foreground py-2">vs</span>
                <div className="w-px h-16 bg-border" />
              </div>

              {/* Variant B */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Variant B (AI Optimized)</span>
                  {showResults && (
                    <span className="text-[10px] text-success font-medium">3.8% conversion</span>
                  )}
                </div>
                <div className="flex-1 rounded-lg border border-border bg-background overflow-hidden relative">
                  <VariantPreview variant="B" />
                  {showResults && abTestResults[1].isWinner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-success text-white text-[10px] font-medium"
                    >
                      <CheckCircle2 className="size-3" />
                      Winner
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test progress bar */}
          {(phase === "testing" || phase === "results" || phase === "complete") && (
            <div className="px-4 py-3 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Test Progress</span>
                <span className="text-xs font-mono text-mypage">{Math.round(testProgress)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-mypage rounded-full"
                  style={{ width: `${testProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span>~25,000 visitors</span>
                <span>Statistical significance: {testProgress >= 100 ? "95%" : "Calculating..."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Results & Metrics */}
        <div className="w-72 border-l border-border flex flex-col bg-muted/10">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-mypage" />
              <span className="text-sm font-medium">Test Results</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {phase !== "results" && phase !== "complete" ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                {phase === "testing" ? (
                  <>
                    <Loader2 className="size-6 animate-spin text-mypage mb-2" />
                    <span className="text-xs">Running A/B test...</span>
                    <span className="text-[10px] mt-1">
                      {Math.round(testProgress * 250)} visitors
                    </span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="size-8 text-muted-foreground/30 mb-2" />
                    <span className="text-xs">Waiting for test data...</span>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result cards */}
                {abTestResults.map((result, i) => (
                  <ResultCard key={result.variant} result={result} delay={i * 0.2} />
                ))}

                {/* Key metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 rounded-lg bg-muted/30 space-y-2"
                >
                  <div className="text-xs font-medium mb-2">Key Metrics</div>
                  <MetricRow icon={Eye} label="Total Visitors" value="25,759" />
                  <MetricRow icon={MousePointer2} label="Total Clicks" value="799" />
                  <MetricRow icon={Clock} label="Test Duration" value="7 days" />
                  <MetricRow icon={Percent} label="Confidence" value="95%" highlight />
                </motion.div>
              </div>
            )}
          </div>

          {/* Deploy action */}
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 border-t border-border"
            >
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-success text-white font-medium text-sm hover:bg-success/90 transition-colors">
                <Sparkles className="size-4" />
                Deploy Winner to Production
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Variant B will be deployed to 100% of traffic
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Phase indicator
function PhaseIndicator({ phase }: { phase: DemoPhase }) {
  const phases: { id: DemoPhase; label: string }[] = [
    { id: "sharing", label: "Share" },
    { id: "reviewing", label: "Review" },
    { id: "voting", label: "Vote" },
    { id: "testing", label: "Test" },
    { id: "results", label: "Results" },
    { id: "complete", label: "Deploy" },
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
              className="size-1.5 rounded-full"
            />
            {i < phases.length - 1 && (
              <div className={`w-2 h-px ${isComplete ? "bg-success" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-[10px] text-muted-foreground">
        {phases.find((p) => p.id === phase)?.label || "Ready"}
      </span>
    </div>
  );
}

// Team member badge
function TeamMemberBadge({ member, isShared }: { member: TeamMember; isShared: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0.4, scale: 0.9 }}
      animate={{
        opacity: isShared ? 1 : 0.4,
        scale: isShared ? 1 : 0.9,
      }}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-background border border-border"
    >
      <div
        className={`size-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
          isShared ? "bg-mypage text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {member.avatar}
      </div>
      <div className="text-xs">
        <div className={`font-medium ${isShared ? "text-foreground" : "text-muted-foreground"}`}>
          {member.name}
        </div>
        <div className="text-[10px] text-muted-foreground">{member.role}</div>
      </div>
      {isShared && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="size-4 rounded-full bg-success/20 flex items-center justify-center"
        >
          <Check className="size-2.5 text-success" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Comment card
function CommentCard({ comment }: { comment: ReviewComment }) {
  const typeStyles = {
    approve: { icon: ThumbsUp, color: "text-success", bg: "bg-success/10" },
    comment: { icon: MessageSquare, color: "text-mypage", bg: "bg-mypage/10" },
    request: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
  };

  const style = typeStyles[comment.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-2.5 rounded-lg bg-background border border-border"
    >
      <div className="flex items-start gap-2">
        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
          {comment.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{comment.author.name}</span>
            <span className="text-[10px] text-muted-foreground">{comment.timestamp}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{comment.text}</p>
        </div>
        <div className={`p-1 rounded ${style.bg}`}>
          <Icon className={`size-3 ${style.color}`} />
        </div>
      </div>
    </motion.div>
  );
}

// Result card
function ResultCard({ result, delay }: { result: ABTestResult; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-3 rounded-lg border ${
        result.isWinner
          ? "border-success/30 bg-success/5"
          : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              result.variant === "A"
                ? "bg-muted text-muted-foreground"
                : "bg-mypage/20 text-mypage"
            }`}
          >
            {result.variant}
          </span>
          <span className="text-xs font-medium">{result.label}</span>
        </div>
        {result.isWinner && (
          <span className="text-[10px] text-success font-medium">Winner</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-muted-foreground">Visitors</div>
          <div className="font-medium">{result.visitors.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Conversions</div>
          <div className="font-medium">{result.conversions}</div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Conversion Rate</span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${result.isWinner ? "text-success" : ""}`}>
            {result.rate}
          </span>
          {result.improvement && (
            <span className="text-xs text-success flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              {result.improvement}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Metric row
function MetricRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        <span>{label}</span>
      </div>
      <span className={`font-medium ${highlight ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}

// Variant previews (mini versions)
function VariantPreview({ variant }: { variant: "A" | "B" }) {
  if (variant === "A") {
    return (
      <div className="p-3 text-[9px]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="font-medium">Acme</span>
            <div className="flex gap-2 text-muted-foreground">
              <span>Products</span>
              <span>Features ▼</span>
              <span>Pricing</span>
            </div>
          </div>
          <button className="px-2 py-1 rounded bg-foreground/10 text-[8px]">Get Started</button>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-3/4 bg-muted rounded" />
          <div className="h-2 w-full bg-muted/50 rounded" />
          <div className="h-2 w-2/3 bg-muted/50 rounded" />
          <div className="flex gap-2 mt-3">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted/50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 text-[9px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="font-medium text-mypage">Acme</span>
          <div className="flex gap-2">
            <span className="font-medium">Products</span>
            <span className="font-medium">Pricing</span>
          </div>
        </div>
        <button className="px-2 py-1 rounded bg-mypage text-white text-[8px]">Start Free</button>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-3/4 bg-muted rounded" />
        <div className="h-2 w-full bg-muted/50 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-20 bg-mypage/20 rounded flex items-center justify-center text-mypage text-[7px]">
            Get Started
          </div>
          <div className="h-6 w-16 border border-border rounded" />
        </div>
        <div className="flex items-center gap-1 text-[7px] text-muted-foreground mt-1">
          <CheckCircle2 className="size-2 text-success" />
          No credit card
        </div>
      </div>
    </div>
  );
}
