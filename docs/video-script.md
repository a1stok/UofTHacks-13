# Frictionless - 3 Minute Demo Script

**Total Time: 3:00**

---

## HOOK (0:00 - 0:15) - 15 seconds

**[VISUAL: Slide 2 - shrug.gif with "Why did users leave?"]**

> "Every week, product teams ask the same question: *Why did users leave?*
> 
> Analytics tell you *what* happened. But not *why*. And definitely not *what to do about it*.
> 
> What if your product could figure that out itself?"

---

## INTRODUCE THE SOLUTION (0:15 - 0:30) - 15 seconds

**[VISUAL: Slide 1 - Hero with streaming events + visual diff + happy users]**

> "This is **Frictionless** - an AI agent that watches user behavior, learns patterns, and ships improvements.
>
> It creates a continuous loop: behavioral data flows in, AI generates insights, and your product gets better - automatically."

---

## THE PROBLEM (DEEPER) (0:30 - 0:50) - 20 seconds

**[VISUAL: Slide 3 - Three problems listed]**

> "Here's the reality for product teams today:
>
> **One** - Users don't tell you what's broken. They just leave.
>
> **Two** - Traditional analytics show dashboards, not decisions.
>
> **Three** - Real UX research costs $10,000 and takes weeks.
>
> We built Frictionless to solve all three - in seconds, not weeks."

---

## HOW IT WORKS - STEP 1 (0:50 - 1:15) - 25 seconds

**[VISUAL: Slide 6 - DataAnalysisDemo showing events streaming in]**

> "**Step one: We capture behavioral events.**
>
> Every click, scroll, rage-click, and moment of hesitation gets tracked - just like Amplitude does for thousands of products.
>
> But we don't just log events. Our AI clusters users, detects friction patterns, and identifies *where* users get stuck.
>
> See this? The AI found a high-friction zone in the signup flow that no one explicitly coded a rule for."

**[Point out: friction zones appearing, pattern detection, AI generating recommendations]**

---

## HOW IT WORKS - STEP 2 (1:15 - 1:40) - 25 seconds

**[VISUAL: Slide 7 - VisualDiffDemo with before/after toggle]**

> "**Step two: Visual diff with actionable insights.**
>
> The AI doesn't just say 'users are dropping off.' It shows you *exactly* what to change.
>
> Here's the original interface. And here's the AI-generated improvement - with annotations explaining *why* each change will help.
>
> Fix the navigation dropdown. Enhance this CTA. Add a pricing comparison where users hesitate.
>
> This isn't a generic suggestion. It's based on *your users' actual behavior*."

---

## HOW IT WORKS - STEP 3 (1:40 - 2:05) - 25 seconds

**[VISUAL: Slide 8 - TeamReviewDemo with voting + A/B test results]**

> "**Step three: Team review and deploy.**
>
> Your team reviews the suggestion. Vote on it. And with one click, ship an A/B test.
>
> Watch - we're running the experiment now. Version A is the original. Version B is the AI-generated variant.
>
> Results come in real-time. And when we hit statistical significance? 
>
> **+58% conversion**. Deploy to production."

**[Show: approval threshold, A/B test progress bar, winner announcement]**

---

## TECHNICAL INTEGRATION (2:05 - 2:25) - 20 seconds

**[VISUAL: Slide 9 - AgentCLIDemo with terminal commands]**

> "For developers, Frictionless integrates with your existing stack.
>
> Connect your Amplitude instance. Connect GitHub. The agent fetches behavioral data, runs analysis in a sandboxed environment, and creates pull requests with the suggested changes.
>
> It's not replacing your workflow - it's enhancing it with AI-powered insights from real user behavior."

**[Show: MCP connections, PR creation, capabilities panel]**

---

## THE VISION (2:25 - 2:45) - 20 seconds

**[VISUAL: Slide 10 - "Every user is unique" with floating avatars]**

> "Here's what makes Frictionless different:
>
> A new user needs guidance. A power user needs speed. An enterprise user needs trust signals.
>
> Frictionless learns from every interaction and adapts the experience for each segment.
>
> This is what Amplitude calls a *self-improving product* - and we built it this weekend."

---

## CLOSE (2:45 - 3:00) - 15 seconds

**[VISUAL: Return to Slide 1 or show dashboard]**

> "Frictionless turns your behavioral analytics into automatic product improvements.
>
> Data in. Insights out. Better products - without the manual work.
>
> We're **Frictionless**. And we're ready to help you build products your users will love."

**[END]**

---

## Speaker Notes

### Key Phrases to Emphasize
- "Behavioral data" (Amplitude criteria)
- "AI detects patterns" (not rules-based)
- "Self-improving product" (Amplitude's exact language)
- "Data → insights → action loop" (Amplitude's core thesis)

### If Asked About Tech Stack
- React Router v7, rrweb for session recording
- React Query for data fetching with smart caching
- Framer Motion for animations
- MCP (Model Context Protocol) for Amplitude and GitHub integration

### If Asked "How is this AI, not rules?"
> "Traditional analytics might say 'if user fails 3 times, show tooltip.' That's a rule.
> 
> Our AI analyzes behavioral patterns across all users, clusters them by behavior, detects anomalies no one coded for, and generates contextual improvements. It's summarizing intent, not matching conditions."

### Amplitude Challenge Alignment
1. **Behavioral data**: Session recordings, click streams, engagement metrics
2. **AI application**: Pattern detection, friction analysis, personalized recommendations
3. **Product impact**: A/B testing, measurable conversion improvements
4. **Innovation**: Full loop from events to deployed improvements
5. **Execution**: Working prototype with clear demo flow

---

## Timing Breakdown

| Section | Duration | Cumulative |
|---------|----------|------------|
| Hook | 0:15 | 0:15 |
| Solution intro | 0:15 | 0:30 |
| Problem deep dive | 0:20 | 0:50 |
| Step 1: Analyze | 0:25 | 1:15 |
| Step 2: Visual diff | 0:25 | 1:40 |
| Step 3: Deploy | 0:25 | 2:05 |
| Technical | 0:20 | 2:25 |
| Vision | 0:20 | 2:45 |
| Close | 0:15 | 3:00 |

---

## Backup: 2-Minute Version (if needed)

Cut:
- Problem deep dive (0:30-0:50) - condense to 5 seconds
- Technical integration (2:05-2:25) - mention briefly in close
- Vision (2:25-2:45) - merge into close

This gets you to ~2:00 while keeping the core demo flow.
