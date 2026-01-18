import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type EventCategory = "engagement" | "conversion" | "navigation" | "system";

interface AnalyticsEvent {
  id: number;
  timestamp: string;
  eventName: string;
  userId: string;
  properties: Record<string, string | number | boolean>;
  category: EventCategory;
}

// Amplitude-style event templates with realistic properties
const eventTemplates: {
  eventName: string;
  category: EventCategory;
  properties: () => Record<string, string | number | boolean>;
}[] = [
  // Engagement events
  {
    eventName: "button_clicked",
    category: "engagement",
    properties: () => ({
      button_id: pickRandom(["cta_hero", "nav_signup", "pricing_start", "demo_request"]),
      page: pickRandom(["/", "/pricing", "/features", "/about"]),
      session_duration_sec: randomInt(5, 300),
    }),
  },
  {
    eventName: "feature_used",
    category: "engagement",
    properties: () => ({
      feature_name: pickRandom(["dashboard", "analytics", "export", "collaboration", "ai_insights"]),
      usage_count: randomInt(1, 50),
      is_power_user: Math.random() > 0.7,
    }),
  },
  {
    eventName: "content_viewed",
    category: "engagement",
    properties: () => ({
      content_type: pickRandom(["blog_post", "documentation", "video", "case_study"]),
      scroll_depth_pct: randomInt(10, 100),
      time_on_page_sec: randomInt(3, 180),
    }),
  },
  {
    eventName: "search_performed",
    category: "engagement",
    properties: () => ({
      query: pickRandom(["pricing", "api docs", "integration", "analytics", "dashboard"]),
      results_count: randomInt(0, 25),
      clicked_result: Math.random() > 0.3,
    }),
  },
  // Conversion events
  {
    eventName: "sign_up_started",
    category: "conversion",
    properties: () => ({
      signup_method: pickRandom(["email", "google", "github", "sso"]),
      referrer: pickRandom(["organic", "paid_search", "social", "referral", "direct"]),
      plan_interest: pickRandom(["free", "pro", "enterprise"]),
    }),
  },
  {
    eventName: "sign_up_completed",
    category: "conversion",
    properties: () => ({
      signup_method: pickRandom(["email", "google", "github", "sso"]),
      time_to_complete_sec: randomInt(30, 180),
      email_verified: Math.random() > 0.2,
    }),
  },
  {
    eventName: "trial_started",
    category: "conversion",
    properties: () => ({
      plan_type: pickRandom(["pro", "enterprise"]),
      trial_duration_days: pickRandom([7, 14, 30]),
      features_enabled: randomInt(3, 12),
    }),
  },
  {
    eventName: "checkout_started",
    category: "conversion",
    properties: () => ({
      plan_type: pickRandom(["pro_monthly", "pro_annual", "enterprise"]),
      cart_value_usd: pickRandom([29, 49, 99, 299]),
      has_discount: Math.random() > 0.7,
    }),
  },
  {
    eventName: "purchase_completed",
    category: "conversion",
    properties: () => ({
      plan_type: pickRandom(["pro_monthly", "pro_annual", "enterprise"]),
      revenue_usd: pickRandom([29, 49, 99, 299]),
      payment_method: pickRandom(["card", "paypal", "invoice"]),
    }),
  },
  // Navigation events
  {
    eventName: "page_viewed",
    category: "navigation",
    properties: () => ({
      page_path: pickRandom(["/", "/pricing", "/features", "/docs", "/blog", "/about", "/contact"]),
      referrer_type: pickRandom(["internal", "external", "direct"]),
      device_type: pickRandom(["desktop", "mobile", "tablet"]),
    }),
  },
  {
    eventName: "onboarding_step_completed",
    category: "navigation",
    properties: () => ({
      step_number: randomInt(1, 5),
      step_name: pickRandom(["profile_setup", "team_invite", "first_project", "integration", "tutorial"]),
      time_spent_sec: randomInt(10, 120),
    }),
  },
  {
    eventName: "navigation_clicked",
    category: "navigation",
    properties: () => ({
      nav_item: pickRandom(["home", "products", "pricing", "docs", "blog", "login"]),
      nav_location: pickRandom(["header", "footer", "sidebar", "mobile_menu"]),
    }),
  },
  // System/behavioral signals
  {
    eventName: "session_started",
    category: "system",
    properties: () => ({
      is_returning_user: Math.random() > 0.4,
      days_since_last_visit: randomInt(0, 30),
      utm_source: pickRandom(["google", "twitter", "linkedin", "newsletter", "(none)"]),
    }),
  },
  {
    eventName: "error_encountered",
    category: "system",
    properties: () => ({
      error_type: pickRandom(["validation", "network", "auth", "timeout"]),
      error_page: pickRandom(["/checkout", "/login", "/api/export", "/settings"]),
      user_action: pickRandom(["retry", "abandon", "contact_support"]),
    }),
  },
  {
    eventName: "rage_click_detected",
    category: "system",
    properties: () => ({
      element: pickRandom(["submit_btn", "loading_spinner", "broken_link", "unresponsive_form"]),
      click_count: randomInt(4, 12),
      frustration_score: randomInt(60, 100),
    }),
  },
  {
    eventName: "feedback_submitted",
    category: "system",
    properties: () => ({
      feedback_type: pickRandom(["nps", "csat", "feature_request", "bug_report"]),
      rating: randomInt(1, 10),
      has_comment: Math.random() > 0.5,
    }),
  },
];

// Weight distribution for event categories (realistic product analytics)
const categoryWeights: { category: EventCategory; weight: number }[] = [
  { category: "navigation", weight: 35 },
  { category: "engagement", weight: 40 },
  { category: "conversion", weight: 15 },
  { category: "system", weight: 10 },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomUserId(): string {
  return `user_${Math.random().toString(36).substring(2, 10)}`;
}

function pickWeightedCategory(): EventCategory {
  const total = categoryWeights.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * total;
  for (const { category, weight } of categoryWeights) {
    random -= weight;
    if (random <= 0) return category;
  }
  return "engagement";
}

function generateEvent(id: number): AnalyticsEvent {
  const category = pickWeightedCategory();
  const categoryTemplates = eventTemplates.filter((t) => t.category === category);
  const template = pickRandom(categoryTemplates);

  const now = new Date();
  const timestamp = now.toISOString().slice(11, 23); // HH:MM:SS.mmm

  return {
    id,
    timestamp,
    eventName: template.eventName,
    userId: randomUserId(),
    properties: template.properties(),
    category: template.category,
  };
}

// Varied timing to feel more organic
function getNextDelay(): number {
  const base = 400;
  const variance = Math.random();
  
  // Occasionally burst (faster), occasionally pause (slower)
  if (variance < 0.1) return base * 0.3; // burst
  if (variance > 0.9) return base * 2.5; // pause
  return base + Math.random() * 400;
}

function formatProperties(props: Record<string, string | number | boolean>): string {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === "boolean") return `${key}=${value}`;
      if (typeof value === "number") return `${key}=${value}`;
      return `${key}="${value}"`;
    })
    .join(" ");
}

export default function StreamingEvents() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    // Generate initial batch with staggered timestamps
    const initial: AnalyticsEvent[] = [];
    const baseTime = Date.now() - 5000;
    
    for (let i = 0; i < 6; i++) {
      idRef.current++;
      const event = generateEvent(idRef.current);
      const offsetTime = new Date(baseTime + i * 800);
      event.timestamp = offsetTime.toISOString().slice(11, 23);
      initial.push(event);
    }
    setEvents(initial);

    // Variable interval for organic feel
    let timeoutId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        idRef.current++;
        const newEvent = generateEvent(idRef.current);
        setEvents((prev) => {
          // Keep last 50 events to prevent memory growth
          const updated = [...prev, newEvent];
          return updated.slice(-50);
        });
        scheduleNext();
      }, getNextDelay());
    };
    
    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [events]);

  return (
    <div className="h-full w-full rounded-lg border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-destructive/60" />
          <div className="size-3 rounded-full bg-warning/60" />
          <div className="size-3 rounded-full bg-success/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          events — live stream
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="size-2 rounded-full bg-success"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs text-muted-foreground">tracking</span>
        </div>
      </div>

      {/* Event content */}
      <div
        ref={containerRef}
        className="font-mono text-xs flex-1 overflow-y-auto overflow-x-hidden bg-background/50 p-2 space-y-px"
      >
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              transition={{ duration: 0.15 }}
              className="py-0.5 hover:bg-muted/30 rounded px-1 -mx-1 truncate"
            >
              <span className="text-muted-foreground/60">{event.timestamp}</span>
              {" "}
              <span className={getCategoryColor(event.category)}>{event.eventName}</span>
              {" "}
              <span className="text-primary/70">[{event.userId}]</span>
              {" "}
              <span className="text-muted-foreground/50">
                {formatProperties(event.properties)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cursor line */}
        <motion.div
          className="py-0.5 px-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <span className="text-muted-foreground/40">▌</span>
        </motion.div>
      </div>
    </div>
  );
}

function getCategoryColor(category: EventCategory): string {
  switch (category) {
    case "navigation":
      return "text-muted-foreground";
    case "engagement":
      return "text-primary";
    case "conversion":
      return "text-success";
    case "system":
      return "text-warning";
  }
}
