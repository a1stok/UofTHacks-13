# 3-Minute Pitch Deck: "Living Interfaces" (Version 2)

## Core Narrative: Identity-Driven Self-Improving Products

### The Story in One Sentence
> *"Your product's interface should reflect each user's behavioral identity — Living Interfaces watches how users actually behave and automatically evolves the UI to match who they are."*

---

## How This Wins Each Criterion

| Criterion | How We Address It |
|-----------|-------------------|
| **Identity Theme** | Behavioral patterns = digital identity. Interface adapts to reflect user identity. |
| **Amplitude Fit** | Events → AI clustering → personalized UI per cohort (the loop) |
| **Innovation** | Not "another chatbot" — AI that changes the actual interface |
| **Technicality** | Behavioral data + AI classification + dynamic UI generation |
| **Product Impact** | Self-improving product that gets better for each user type |

---

## Overview & Timing

| Slide | Title | Time | Purpose |
|-------|-------|------|---------|
| **1** | Living Interfaces (existing) | 10s | Overview hook |
| **2** | The Identity Problem | 15s | Establish pain point |
| **3** | Behavioral Identity | 20s | Reveal the insight |
| **4** | Living Interfaces Solution | 15s | What we built |
| **5** | Demo: Events → Identity | 30s | Show events revealing identity |
| **6** | Demo: AI Clustering | 30s | AI finds emergent patterns |
| **7** | Demo: Interface Morphs | 30s | Same product, different UI per identity |
| **8** | The Self-Improving Loop | 15s | The feedback loop |
| **9** | Impact + Amplitude Fit | 20s | Why this wins |
| **10** | Close | 15s | Memorable ending |

**Total: 10 slides, 3 minutes**

---

## Slide-by-Slide Breakdown

---

### SLIDE 1: Living Interfaces (Existing)

**Visual:** Current slide-1 with StreamingEvents, VisualDiff, HappyUsers

**Say:**
> "What if your interface could evolve based on who your users actually are?"

---

### SLIDE 2: The Identity Problem

**Visual:** Three user personas side by side, each failing differently

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   "One interface. Three very different users."         │
│                                                        │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐          │
│   │  👤 Pro  │   │ 👤 New   │   │ 👤 Lost  │          │
│   │  ──────  │   │  ──────  │   │  ──────  │          │
│   │ "Where's │   │ "What do │   │ "I give  │          │
│   │  my      │   │  I click │   │   up"    │          │
│   │ shortcut?│   │  first?" │   │          │          │
│   └──────────┘   └──────────┘   └──────────┘          │
│                                                        │
│         Same UI fails all three differently.           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `UserPersonaCard` - shows user avatar, identity type, quote/pain point
- Three cards side by side with distinct colors:
  - Green = Power User (Pro)
  - Blue = Explorer (New)
  - Red = At-Risk (Lost)
- Animation: cards appear sequentially (staggered entrance)

**Say:**
> "Meet three users. A power user who wants speed. A newcomer who needs guidance. And someone about to leave. Same interface. Fails all three differently."

---

### SLIDE 3: Behavioral Identity Reveal

**Visual:** Event stream on left, identity signals on right

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   "Behavior reveals identity"                          │
│                                                        │
│   ┌─────────────────────────────────────────────┐     │
│   │ EVENT STREAM              IDENTITY SIGNAL   │     │
│   │ ───────────────────────────────────────────│     │
│   │ keyboard_shortcut_used   → 🟢 Power User    │     │
│   │ keyboard_shortcut_used   → 🟢               │     │
│   │ feature_deep_dive        → 🟢               │     │
│   │ ───────────────────────────────────────────│     │
│   │ tutorial_viewed          → 🔵 Explorer      │     │
│   │ help_search: "how to..." → 🔵               │     │
│   │ slow_deliberate_click    → 🔵               │     │
│   │ ───────────────────────────────────────────│     │
│   │ rage_click               → 🔴 At-Risk       │     │
│   │ error_repeated           → 🔴               │     │
│   │ support_button_hover     → 🔴               │     │
│   └─────────────────────────────────────────────┘     │
│                                                        │
│   "Their clicks tell us who they are."                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `IdentityEventStream` - extends existing `StreamingEvents`
- Two columns: event name | identity classification
- Events are tagged with identity signals in real-time
- Color coding matches personas: green=power, blue=explorer, red=at-risk
- Auto-scrolling, simulated real-time feel

**Event Schema Examples:**
```typescript
// Power User signals (green)
{ event: "keyboard_shortcut_used", identity: "power", confidence: 0.9 }
{ event: "feature_deep_dive", identity: "power", confidence: 0.85 }
{ event: "bulk_action_executed", identity: "power", confidence: 0.8 }

// Explorer signals (blue)
{ event: "tutorial_viewed", identity: "explorer", confidence: 0.9 }
{ event: "help_search", query: "how to...", identity: "explorer", confidence: 0.85 }
{ event: "slow_deliberate_click", identity: "explorer", confidence: 0.7 }

// At-Risk signals (red)
{ event: "rage_click", identity: "at-risk", confidence: 0.95 }
{ event: "error_repeated", count: 3, identity: "at-risk", confidence: 0.9 }
{ event: "support_button_hover", duration: 2000, identity: "at-risk", confidence: 0.8 }
```

**Say:**
> "Users don't fill out forms telling us who they are. But their behavior does. Keyboard shortcuts? Power user. Help searches? Explorer. Rage clicks? They're about to leave."

---

### SLIDE 4: The Solution

**Visual:** Simple 3-step flow diagram

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│            ✦ LIVING INTERFACES ✦                       │
│                                                        │
│      "Interfaces that know who you are"                │
│                                                        │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐       │
│   │ EVENTS  │  →   │   AI    │  →   │ADAPTED  │       │
│   │ ─────── │      │ IDENTITY│      │  UI     │       │
│   │ clicks  │      │ CLUSTER │      │ ─────── │       │
│   │ paths   │      │         │      │ per     │       │
│   │ pauses  │      │ Power   │      │ user    │       │
│   │ errors  │      │ Explorer│      │ type    │       │
│   │         │      │ At-Risk │      │         │       │
│   └─────────┘      └─────────┘      └─────────┘       │
│                                                        │
│   "Data → Identity → Interface. The self-improving     │
│    product loop."                                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `SolutionFlowDiagram` - three boxes with animated arrows
- Can animate the flow left-to-right on slide enter
- Reuse iconography from slide-1 (ChartArea, LayoutTemplate, etc.)

**Say:**
> "We built Living Interfaces. Events flow in, AI clusters users by behavioral identity, and the interface adapts. This is the self-improving product loop."

---

### SLIDE 5: Demo - Events Flowing In

**Visual:** Enhanced event stream showing a user session

```
┌────────────────────────────────────────────────────────┐
│  LIVE USER SESSION                          user_847   │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 00:01  page_viewed: "/dashboard"                │  │
│  │ 00:03  element_clicked: "search_bar"            │  │
│  │ 00:05  search_query: "export data"              │  │
│  │ 00:08  element_clicked: "menu_file"             │  │
│  │ 00:09  element_clicked: "menu_file" (x2)        │  │
│  │ 00:10  element_clicked: "menu_file" (x3) ⚠️     │  │
│  │ 00:11  rage_click_detected: "menu_file" 🔴      │  │
│  │ 00:14  help_search: "where is export"           │  │
│  │ 00:18  support_button_hover (2.3s)              │  │
│  │                                                 │  │
│  │        IDENTITY EMERGING: At-Risk 🔴            │  │
│  │        Confidence: 87%                          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `LiveSessionStream` - shows single user journey with timestamps
- Progressive identity confidence building
- Highlight friction moments (rage clicks, repeated errors)
- Bottom bar shows emerging identity classification

**Say:**
> "Here's a real user session. Watch the events — they searched for export, clicked the menu three times, rage clicked, then searched help. The AI sees this pattern: At-Risk, 87% confidence. They're about to leave."

---

### SLIDE 6: Demo - AI Clustering

**Visual:** Scatter plot or radial diagram showing users clustering

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   IDENTITY CLUSTERS                    Last 24 hours   │
│                                                        │
│                    🟢 🟢                               │
│               🟢  🟢🟢🟢  🟢                           │
│                  🟢🟢🟢                                │
│        POWER USERS (23%)                               │
│                                                        │
│                         🔵🔵                           │
│                      🔵🔵🔵🔵🔵                        │
│                        🔵🔵🔵                          │
│                    EXPLORERS (58%)                     │
│                                                        │
│                              🔴                        │
│                           🔴🔴🔴                       │
│                             🔴                         │
│                      AT-RISK (19%)                     │
│                                                        │
│   ─────────────────────────────────────────────────   │
│   AI detected 3 distinct behavioral identity clusters  │
│   No rules. No manual segmentation. Emergent patterns. │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `IdentityClusterViz` - scatter plot with clustering animation
- Could use Recharts (already in project) or simple CSS animations
- Dots flow in from left (events), then cluster into groups
- Show percentages for each cluster
- Key message: "No rules. Emergent patterns."

**Technical approach:**
```typescript
// Cluster data structure
const clusters = [
  { id: "power", label: "Power Users", color: "#22c55e", percentage: 23, count: 847 },
  { id: "explorer", label: "Explorers", color: "#3b82f6", percentage: 58, count: 2134 },
  { id: "at-risk", label: "At-Risk", color: "#ef4444", percentage: 19, count: 699 },
];
```

**Say:**
> "Here's what the AI found across all users. Three distinct identity clusters emerged — not from rules we wrote, but from behavioral patterns. 23% power users, 58% explorers, 19% at-risk. The AI sees what we couldn't code for."

---

### SLIDE 7: Demo - Interface Morphs

**Visual:** Same base interface transforming 3 ways

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   SAME PRODUCT. ADAPTED INTERFACE.                     │
│                                                        │
│   ┌─────────────────────────────────────────────────┐ │
│   │ 🟢 POWER USER INTERFACE                         │ │
│   │ ───────────────────────────────────────────────│ │
│   │ • Keyboard shortcuts visible (⌘E for export)   │ │
│   │ • Compact toolbar, no tooltips                 │ │
│   │ • Advanced features surfaced                   │ │
│   │ • Bulk actions prominent                       │ │
│   └─────────────────────────────────────────────────┘ │
│                                                        │
│   ┌─────────────────────────────────────────────────┐ │
│   │ 🔵 EXPLORER INTERFACE                           │ │
│   │ ───────────────────────────────────────────────│ │
│   │ • Guided tooltips on hover                     │ │
│   │ • "Discover" prompts for unused features       │ │
│   │ • Contextual help integrated                   │ │
│   │ • Progressive disclosure of complexity         │ │
│   └─────────────────────────────────────────────────┘ │
│                                                        │
│   ┌─────────────────────────────────────────────────┐ │
│   │ 🔴 AT-RISK INTERFACE                            │ │
│   │ ───────────────────────────────────────────────│ │
│   │ • Simplified UI, fewer options visible         │ │
│   │ • Clear escape hatches ("Need help?")          │ │
│   │ • Proactive support chat trigger               │ │
│   │ • Success celebrations on small wins           │ │
│   └─────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `AdaptiveInterfaceDemo` - shows three interface variants
- Could be tabs or side-by-side comparison
- Ideally: animate switching between them
- Even better: show a mini UI mockup that transforms

**Alternative visual (more impactful):**
```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ 🟢 Power User     │  │ 🔵 Explorer       │  │ 🔴 At-Risk        │
│ ┌───────────────┐ │  │ ┌───────────────┐ │  │ ┌───────────────┐ │
│ │[⌘E][⌘S][⌘N]   │ │  │ │ Welcome! 👋   │ │  │ │ Need help?    │ │
│ │───────────────│ │  │ │ Try this →    │ │  │ │ [Chat] [Call] │ │
│ │ Bulk Actions  │ │  │ │───────────────│ │  │ │───────────────│ │
│ │ [Select All]  │ │  │ │ ? Hover tips  │ │  │ │ Simple Mode ✓ │ │
│ └───────────────┘ │  │ └───────────────┘ │  │ └───────────────┘ │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

**Say:**
> "Same product, three different interfaces. Power users get shortcuts and bulk actions. Explorers get guided discovery. At-risk users get simplified UI and proactive support. The interface matches their identity."

---

### SLIDE 8: The Self-Improving Loop

**Visual:** Circular diagram showing the feedback loop

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│         THE SELF-IMPROVING LOOP                        │
│                                                        │
│              ┌──────────────┐                          │
│              │   BEHAVIOR   │                          │
│              │   EVENTS     │                          │
│              └──────┬───────┘                          │
│                     │                                  │
│                     ▼                                  │
│              ┌──────────────┐                          │
│         ┌────│  AI DETECTS  │────┐                     │
│         │    │   IDENTITY   │    │                     │
│         │    └──────────────┘    │                     │
│         │                        │                     │
│         ▼                        ▼                     │
│   ┌──────────┐            ┌──────────────┐             │
│   │  LEARNS  │◄───────────│   ADAPTS     │             │
│   │   from   │            │  INTERFACE   │             │
│   │ outcomes │            │              │             │
│   └──────────┘            └──────────────┘             │
│                                                        │
│   ─────────────────────────────────────────────────   │
│   • At-risk user stayed? Learn that intervention.     │
│   • Power user ignored shortcut? Adjust placement.    │
│   • Explorer converted to power? Track the journey.   │
│   ─────────────────────────────────────────────────   │
│                                                        │
│   "The more you use it, the smarter it gets."         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `SelfImprovingLoopDiagram` - circular flow with animated arrows
- Three bullet points showing learning examples
- Animation: loop cycles continuously

**Say:**
> "And here's the key: it's self-improving. Did that at-risk user stay after we showed them support? The AI learns. Did the power user ignore the shortcut hint? Adjust. Every outcome makes the system smarter at detecting identity and choosing the right adaptation."

---

### SLIDE 9: Impact + Amplitude Fit

**Visual:** Two-column layout

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   WHY THIS WINS                                        │
│                                                        │
│   ┌────────────────────┬────────────────────────────┐ │
│   │   REAL IMPACT      │   AMPLITUDE FIT            │ │
│   ├────────────────────┼────────────────────────────┤ │
│   │                    │                            │ │
│   │ ✓ Reduces churn by │ ✓ Behavioral event schema  │ │
│   │   catching at-risk │   (clicks, paths, errors)  │ │
│   │   users early      │                            │ │
│   │                    │ ✓ AI does what rules can't │ │
│   │ ✓ Faster onboarding│   (emergent clustering,    │ │
│   │   for explorers    │    pattern detection)      │ │
│   │                    │                            │ │
│   │ ✓ Higher engagement│ ✓ Data → Insight → Action  │ │
│   │   for power users  │   loop (events → identity  │ │
│   │                    │   → adapted UI)            │ │
│   │ ✓ Product teams    │                            │ │
│   │   would ship this  │ ✓ Self-improving product   │ │
│   │   TODAY            │   (learns from outcomes)   │ │
│   │                    │                            │ │
│   └────────────────────┴────────────────────────────┘ │
│                                                        │
│   ┌─────────────────────────────────────────────────┐ │
│   │ 🎯 IDENTITY THEME                               │ │
│   │ "Behavioral patterns ARE digital identity.      │ │
│   │  Your clicks tell us who you are."              │ │
│   └─────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components to build:**
- `ImpactGrid` - two-column checklist layout
- Identity theme callout box at bottom
- Clean, scannable for judges

**Say:**
> "Why does this win? Real impact — reduces churn, speeds onboarding, increases engagement. Product teams would ship this today. And it's a perfect Amplitude fit: behavioral events, AI beyond rules, the data-to-action loop, self-improving. And for the identity theme: behavioral patterns ARE digital identity. Your clicks tell us who you are."

---

### SLIDE 10: Close

**Visual:** Logo, tagline, team

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│              ✦ LIVING INTERFACES ✦                     │
│                                                        │
│        "Interfaces that know who you are"              │
│                                                        │
│   ─────────────────────────────────────────────────   │
│                                                        │
│      From behavior → to identity → to experience       │
│                                                        │
│   ─────────────────────────────────────────────────   │
│                                                        │
│                  Team: [Your Names]                    │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Say:**
> "Living Interfaces. Interfaces that know who you are. We turn behavioral data into identity-aware experiences that improve themselves. Thank you."

---

## Technical Implementation Plan

### Priority Order (8+ hours available)

| Priority | Component | Time Est | Impact | Slide |
|----------|-----------|----------|--------|-------|
| 1 | `UserPersonaCard` × 3 | 1h | Sets up identity narrative | 2 |
| 2 | `IdentityEventStream` | 2h | Core demo component | 3, 5 |
| 3 | `IdentityClusterViz` | 2h | "Wow" moment - AI visualization | 6 |
| 4 | `AdaptiveInterfaceDemo` | 2h | Payoff moment | 7 |
| 5 | `SolutionFlowDiagram` | 1h | Clean explanation | 4 |
| 6 | `SelfImprovingLoopDiagram` | 0.5h | Reinforce the loop | 8 |
| 7 | `ImpactGrid` | 0.5h | Judge-friendly summary | 9 |
| 8 | Close slide | 0.5h | Quick | 10 |
| 9 | Polish + transitions | 1h | Professional feel | All |

**Total: ~10.5 hours**

---

### Component Specifications

#### 1. UserPersonaCard

```typescript
interface UserPersonaCardProps {
  type: "power" | "explorer" | "at-risk";
  icon: string; // emoji or lucide icon
  label: string;
  quote: string;
  color: string; // tailwind color class
  delay?: number; // animation delay for staggered entrance
}

// Usage
<UserPersonaCard
  type="power"
  icon="Zap"
  label="Power User"
  quote="Where's my keyboard shortcut?"
  color="green"
  delay={0}
/>
```

#### 2. IdentityEventStream

```typescript
interface IdentityEvent {
  timestamp: string;
  event: string;
  properties?: Record<string, any>;
  identity: "power" | "explorer" | "at-risk" | null;
  confidence?: number;
}

interface IdentityEventStreamProps {
  events: IdentityEvent[];
  showIdentityColumn?: boolean;
  autoScroll?: boolean;
  speed?: number; // ms between events
}
```

#### 3. IdentityClusterViz

```typescript
interface Cluster {
  id: string;
  label: string;
  color: string;
  percentage: number;
  count: number;
  position: { x: number; y: number };
}

interface IdentityClusterVizProps {
  clusters: Cluster[];
  animated?: boolean;
  showLabels?: boolean;
}
```

#### 4. AdaptiveInterfaceDemo

```typescript
interface InterfaceVariant {
  identity: "power" | "explorer" | "at-risk";
  features: string[];
  mockupElement?: React.ReactNode;
}

interface AdaptiveInterfaceDemoProps {
  variants: InterfaceVariant[];
  layout: "tabs" | "side-by-side" | "stacked";
}
```

---

### Mock Data for Demo

#### Event Stream Data

```typescript
const mockEvents: IdentityEvent[] = [
  // Power user session
  { timestamp: "00:01", event: "keyboard_shortcut_used", properties: { key: "⌘K" }, identity: "power", confidence: 0.7 },
  { timestamp: "00:03", event: "bulk_select_activated", identity: "power", confidence: 0.8 },
  { timestamp: "00:05", event: "advanced_filter_applied", identity: "power", confidence: 0.85 },
  
  // Explorer session
  { timestamp: "00:01", event: "page_viewed", properties: { page: "/getting-started" }, identity: "explorer", confidence: 0.6 },
  { timestamp: "00:04", event: "tooltip_hovered", properties: { duration: 3200 }, identity: "explorer", confidence: 0.7 },
  { timestamp: "00:08", event: "help_search", properties: { query: "how to export" }, identity: "explorer", confidence: 0.85 },
  
  // At-risk session
  { timestamp: "00:01", event: "page_viewed", properties: { page: "/dashboard" }, identity: null },
  { timestamp: "00:03", event: "element_clicked", properties: { target: "export_btn" }, identity: null },
  { timestamp: "00:04", event: "element_clicked", properties: { target: "export_btn" }, identity: "at-risk", confidence: 0.5 },
  { timestamp: "00:05", event: "rage_click_detected", properties: { target: "export_btn", count: 4 }, identity: "at-risk", confidence: 0.9 },
  { timestamp: "00:08", event: "support_button_hover", properties: { duration: 2100 }, identity: "at-risk", confidence: 0.95 },
];
```

---

## Key Lines for Judges

Use these phrases to tie everything together:

### For Identity Theme
> *"Behavioral patterns are digital identity. Your clicks tell us who you are."*

### For Amplitude Track
> *"This is the data → insight → action loop, but for interfaces. Events reveal identity, AI clusters users, UI adapts automatically."*

### For Innovation
> *"Most tools show you dashboards. We change the actual interface. The product improves itself."*

### For the Win
> *"Living Interfaces. Because your product should know who it's talking to."*

---

## Full Rehearsal Script (3 minutes)

> "What if your interface could evolve based on who your users actually are?
>
> Meet three users. A power user who wants speed. A newcomer who needs guidance. And someone about to leave. Same interface — fails all three differently.
>
> But here's the insight: users don't tell us who they are. Their behavior does. Keyboard shortcuts? Power user. Help searches? Explorer. Rage clicks? They're about to churn.
>
> We built Living Interfaces. Events flow in, AI clusters users by behavioral identity, and the interface adapts automatically.
>
> [DEMO: Events]
> Watch this user session. They searched for export, rage clicked, searched help again. The AI sees it: At-Risk, 87% confidence.
>
> [DEMO: Clustering]
> Across all users, three identity clusters emerge. Not from rules — from patterns. 23% power users, 58% explorers, 19% at-risk.
>
> [DEMO: Interface morphing]
> Same product, three interfaces. Power users get shortcuts. Explorers get guided discovery. At-risk users get simplified UI and proactive support.
>
> And it's self-improving. Every outcome teaches the system. Did that at-risk user stay? Learn that intervention. The more you use it, the smarter it gets.
>
> Why does this win? Real impact — reduces churn, speeds onboarding, increases engagement. Perfect Amplitude fit — behavioral events, AI beyond rules, the data-to-action loop. And for identity: behavioral patterns ARE digital identity.
>
> Living Interfaces. Interfaces that know who you are. Thank you."

---

## Demo Checklist

| Must Have | Nice to Have |
|-----------|--------------|
| ✅ Three persona cards (Slide 2) | Animated entrance |
| ✅ Identity event stream (Slide 3, 5) | Real-time simulation |
| ✅ Cluster visualization (Slide 6) | Animated clustering |
| ✅ Three interface variants (Slide 7) | Interactive switching |
| ✅ Flow diagrams (Slides 4, 8) | Animated arrows |
| ✅ Impact summary (Slide 9) | Metrics/numbers |

---

## File Structure

```
packages/web/app/components/slides/
├── index.ts                    # Export all slides
├── slide-1.tsx                 # Existing - keep as-is
├── slide-2.tsx                 # Identity Problem
├── slide-3.tsx                 # Behavioral Identity
├── slide-4.tsx                 # Solution Flow
├── slide-5.tsx                 # Demo: Events
├── slide-6.tsx                 # Demo: Clustering
├── slide-7.tsx                 # Demo: Interface Morphs
├── slide-8.tsx                 # Self-Improving Loop
├── slide-9.tsx                 # Impact + Amplitude Fit
├── slide-10.tsx                # Close
├── user-persona-card.tsx       # Shared component
├── identity-event-stream.tsx   # Shared component
├── identity-cluster-viz.tsx    # Shared component
├── adaptive-interface-demo.tsx # Shared component
├── solution-flow-diagram.tsx   # Shared component
├── self-improving-loop.tsx     # Shared component
└── impact-grid.tsx             # Shared component
```

---

## Next Steps

1. [ ] Build `UserPersonaCard` component
2. [ ] Build `IdentityEventStream` component
3. [ ] Build `IdentityClusterViz` component
4. [ ] Build `AdaptiveInterfaceDemo` component
5. [ ] Build diagram components (flow, loop)
6. [ ] Wire up slides 2-10
7. [ ] Add animations/transitions
8. [ ] Rehearse 5x to nail timing
