## Technical Challenge: Build Self‑Improving Products with Amplitude - Behavioral

## Data + AI

## Challenge Description

**Amplitude** is the leading AI-first digital analytics platform, helping thousands of companies
build better products and digital experiences with behavioral data and AI. With powerful
**Amplitude AI Agents** embedded across the platform, teams can analyze, test, and optimize
user experiences faster than ever—turning raw events into an always-on “data → insights →
action” loop.
Your challenge is to build something that **feels like a mini self‑improving**^1 **product** :
● Track **product analytics-style event data** (the actions users took in your app), and
● Use **AI on top of that data** to make the experience smarter, more personalized, or more
optimized.
You can apply this challenge to almost anything you want to build this weekend:
● A mobile or web app
● A game or learning tool
● A non-GUI interface
● A productivity, dev, or campus-life tool
As long as your project shows an **Amplitude-style loop** —from user **behavioral events** →
**AI-powered insight or decision** → **change in the product experience** —it qualifies.
You **do not** need a production Amplitude instance for this challenge. Storing events locally,
in-memory, etc. are all acceptable, as long as you:

1. Treat your data like **behavioral product analytics** (track events and properties, such as
    sign_up_started, lesson_completed, page_viewed, plan_type, rage_click,
    etc.), and
2. Show how **AI uses that data** to do something that a basic rules engine could not.
**Example directions** (inspired by how customers use Amplitude) **:**
● **AI-powered product assistant**
Build a contextual in-product helper that “watches” user behavior events and uses AI

(^1) A “self-improving” product is one that:
● Continuously observes user behavior through events
● Uses AI to learn patterns and intent from that behavior
● Adapts the product, content, or experience over time


to answer questions, suggest the next best action, or trigger walkthroughs when a user
gets stuck—similar to how Amplitude AI Agents help teams understand what’s
happening and what to do next.
● **Personalized journeys & recommendations**
Use event streams to segment users (e.g., “new vs. power users”, “likely to churn”) and
apply AI to tailor content, difficulty, or UI flows in real time.
● **Automated product insights**
Treat AI like a junior data analyst: give it funnels, cohorts, or time-series data and have
it automatically surface trends, anomalies, or experiment ideas—like Amplitude’s
automated experiment variant generator for optimizing your product.
● **Proactive retention / “save” systems**
Detect behavioral signals like repeated errors, rage clicks, drop-offs, or stalled
progress, and use AI to decide when and how to intervene (smart nudges, help content,
or alternative flows).
● **Feedback + behavior intelligence**
Combine qualitative feedback (text, surveys, reviews) with behavioral data, then use AI
to summarize user pain points and propose concrete product changes—similar to how
**AI Feedback** turns unstructured feedback into product insights.
You can also draw inspiration from core areas of the **Amplitude Digital Analytics Platform** :
● **Product Analytics / Marketing Analytics** – understand the full user journey
● **Session Replay & behavioral signals** – connect “what happened” with “why”
● **Guides and Surveys / Feature Experimentation** – test and personalize experiences
● **AI Agents, AI Feedback, AI Visibility, Amplitude MCP** – examples of AI infused
directly into analytics and workflows


## Judging Criteria

Projects will be evaluated on how well they combine **behavioral analytics** with **AI** in a way that
feels realistic for a modern digital product.

**1. Use of Behavioral Data & Analytics (25%)**
* Does your project define a clear **event schema** (e.g., key events, properties, and user
identifiers) that mirrors how real teams would instrument a product with Amplitude?
    ● Is it obvious how user behavior flows through your system (e.g., funnels, segments, or
       cohorts)?
    ● Do you make good use of that data—rather than just logging it—for decisions or
       personalization?
**2. AI Application & Technical Depth (25%)**
* Is AI doing something **substantive** with your data (clustering, recommendation,
summarization, anomaly detection, prediction, intelligent routing, etc.)?
    ● Is it clear how AI improves your experience beyond simple if/else rules?
       ○ Not AI (rules-based example): “If user fails 3 times, show a tooltip”
       ○ AI-powered example: “Summarize patterns or anomalies no one explicitly
          coded for”
    ● Bonus: thoughtful prompt design, chaining multiple steps, or connecting to external
       models/tools.
**3. Product Impact & User Experience (25%)**
* Would a real product, growth, or marketing team find this genuinely useful to ship on top of a
platform like Amplitude?
    ● Is the user experience understandable and compelling—even if the UI is simple?
    ● Does your project help users **accomplish something better or faster** (e.g., onboard
       more smoothly, avoid churn, learn more effectively, find what they need)?
**4. Innovation & “Amplitude Fit” (15%)**
* Is the idea **creative** in how it fuses behavioral data and AI—something that feels aligned with
Amplitude’s vision of self‑improving products?
    ● Does it show a fresh angle on using analytics + AI (rather than “just another chatbot”)?
    ● Does it reflect an understanding of the **data → insights → action** loop at the heart of
       Amplitude?


```
○ e.g., “thinking in events, not page views”, “modeling user journeys over time”,
“using data to decide what to do next, not just report metrics”
```
**5. Execution & Demo Quality (10%)**
* Do you have a **working prototype** that clearly demonstrates:
* Users generating events →
* Events being processed/analyzed →
* AI driving a visible change or insight?
    ● Is the problem, your data model, and your AI approach explained clearly in your demo
       and Devpost submission?
    ● Do you explicitly call out how your solution is inspired by or could integrate with the
       **Amplitude Digital Analytics Platform** or **Amplitude AI Agents** (even if you’re using

# mocks)

## What to Cover in Your Submission

To help judges quickly understand your work, make sure your Devpost and demo explain:
● **Problem & users**
○ Who is this for, and what problem are you solving?
● **Events & data model**
○ What user events are you tracking (names + properties)?
○ How does this mirror a real analytics setup?
● **AI behavior**
○ What exactly is the AI doing with the data (e.g., “we cluster users by behavior
and then...”)?
● **Impact on the experience**
○ What becomes possible for users or teams _because_ you combined **behavioral
analytics + AI** , rather than using either alone?
Build anything you want—as long as you treat Amplitude’s core idea: **use product data plus AI
to build products and experiences your users will love.**


