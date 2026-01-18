"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SmileIcon, TrendingUp, Heart, Star, Users, ArrowUp } from "lucide-react";

export default function HappyUsers() {
  const [count, setCount] = useState(0);
  const [visibleFeedback, setVisibleFeedback] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [cycle, setCycle] = useState(0);

  // Animate the percentage counting up
  useEffect(() => {
    const targetCount = 94;
    const duration = 1500;
    const steps = 30;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        current = targetCount;
        clearInterval(interval);
      }
      setCount(Math.round(current));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [cycle]);

  // Staggered feedback cards
  useEffect(() => {
    setVisibleFeedback([]);
    setShowStats(false);

    const timers = [
      setTimeout(() => setVisibleFeedback([0]), 800),
      setTimeout(() => setVisibleFeedback([0, 1]), 1200),
      setTimeout(() => setVisibleFeedback([0, 1, 2]), 1600),
      setTimeout(() => setShowStats(true), 2000),
    ];

    // Reset and cycle
    const resetTimer = setTimeout(() => {
      setCycle((c) => c + 1);
    }, 6000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(resetTimer);
    };
  }, [cycle]);

  const feedbackItems = [
    { icon: <Heart className="size-3 text-destructive" />, text: "Love the new interface!", time: "2m ago" },
    { icon: <Star className="size-3 text-warning" />, text: "So much easier to use now", time: "5m ago" },
    { icon: <TrendingUp className="size-3 text-success" />, text: "Conversion up 40%", time: "12m ago" },
  ];

  return (
    <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground">User Happiness</span>
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="size-1.5 rounded-full bg-success"
          />
          <span className="text-[10px] text-success">live</span>
        </div>
      </div>

      {/* Main metric with animated graph */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <motion.div
              key={count}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-semibold text-success"
            >
              {count}%
            </motion.div>
            <div className="text-xs text-muted-foreground">Satisfaction Score</div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs"
          >
            <ArrowUp className="size-3" />
            <span>+12%</span>
          </motion.div>
        </div>

        {/* Mini graph */}
        <SatisfactionGraph />
      </div>

      {/* Feedback cards */}
      <div className="flex-1 p-3 space-y-2 overflow-hidden">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Recent Feedback
        </div>
        <AnimatePresence>
          {feedbackItems.map((item, i) =>
            visibleFeedback.includes(i) ? (
              <FeedbackCard key={i} icon={item.icon} text={item.text} time={item.time} index={i} />
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Stats footer */}
      <div className="px-3 py-2 border-t border-border bg-muted/20">
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="NPS" value="+72" show={showStats} delay={0} />
          <MiniStat label="Retention" value="96%" show={showStats} delay={0.1} />
          <MiniStat label="Reviews" value="4.9" show={showStats} delay={0.2} />
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="px-3 py-2 border-t border-border bg-success/5 flex items-center justify-center gap-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <SmileIcon className="size-4 text-success" />
        </motion.div>
        <span className="text-xs text-success font-medium">All metrics improving</span>
      </div>
    </div>
  );
}

// Animated satisfaction graph
function SatisfactionGraph() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Data points representing satisfaction over time (normalized 0-100)
  const dataPoints = [45, 52, 48, 58, 62, 68, 72, 78, 85, 88, 91, 94];

  return (
    <div className="h-16 flex items-end gap-0.5">
      {dataPoints.map((value, i) => {
        const height = (value / 100) * 100;
        const isLast = i === dataPoints.length - 1;
        const color = value >= 80 ? "bg-success" : value >= 60 ? "bg-mypage" : "bg-muted-foreground/50";

        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={animate ? { height: `${height}%` } : {}}
            transition={{
              delay: i * 0.08,
              duration: 0.4,
              ease: "easeOut",
            }}
            className={`flex-1 rounded-t ${color} ${isLast ? "ring-2 ring-success/30" : ""}`}
          />
        );
      })}
    </div>
  );
}

function FeedbackCard({
  icon,
  text,
  time,
  index,
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-2 p-2 rounded-md bg-background border border-border"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span className="text-xs flex-1 truncate">{text}</span>
      <span className="text-[10px] text-muted-foreground">{time}</span>
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
  show,
  delay,
}: {
  label: string;
  value: string;
  show: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
      className="text-center p-1.5 rounded-md bg-muted/50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={show ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.1, type: "spring", stiffness: 300 }}
        className="text-sm font-semibold text-success"
      >
        {value}
      </motion.div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </motion.div>
  );
}
