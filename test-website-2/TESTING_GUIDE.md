# A/B Testing & Amplitude Integration - Testing Guide

## 🚀 Quick Start

1. **Start Test Website**: `npm run dev` (runs on http://localhost:5175)
2. **Start Dashboard**: `cd ../dashboard/frontend && npm run dev` (runs on http://localhost:5174)

## 🧪 A/B Testing Features Implemented

### 1. Hero Section A/B Test
- **Flag Key**: `hero_layout_test`
- **Variant A (Control)**: Left-aligned layout, standard copy
- **Variant B**: Center-aligned, enhanced copy with emojis, larger buttons

### 2. Pricing Section A/B Test  
- **Flag Key**: `pricing_layout_test`
- **Variant A (Control)**: Standard pricing grid
- **Variant B**: Highlighted middle plan, different heading

### 3. Comprehensive Event Tracking

#### Core Events:
- `page_view` - Page loads
- `section_viewed` - Sections come into viewport
- `button_clicked` - CTA button interactions
- `scroll_depth` - 25%, 50%, 75%, 100% scroll tracking

#### A/B Testing Events:
- `experiment_exposure` - When variant is shown to user
- `conversion` - When user takes desired action
- `user_flow_step` - User journey tracking
- `element_interaction` - Detailed interaction tracking

#### Advanced Events:
- `form_submission` - Form completions
- User properties for segmentation

## 📊 Amplitude SDK Features

### Analytics Features:
- ✅ Real-time event tracking
- ✅ User identification and properties
- ✅ Session tracking
- ✅ Custom event properties
- ✅ Automatic page view tracking

### Experiment Features:
- ✅ Feature flag evaluation
- ✅ Variant assignment
- ✅ Exposure tracking
- ✅ Conversion attribution
- ✅ User flow analysis

### Session Replay:
- ✅ Session recording (100% sample rate for demo)
- ✅ User interaction capture
- ✅ Privacy controls (configurable masking)

## 🎯 Testing Scenarios

### Scenario 1: Hero A/B Test
1. Visit http://localhost:5175
2. Refresh page multiple times to see different variants
3. Click CTA buttons in each variant
4. Check dashboard for conversion data

### Scenario 2: User Flow Tracking
1. Load landing page
2. Scroll through sections (triggers section_viewed events)
3. Click pricing buttons (triggers conversion events)
4. View dashboard to see user flow data

### Scenario 3: Dashboard Integration
1. Open dashboard at http://localhost:5174
2. Navigate to "A/B Testing" tab
3. View real-time metrics from test website
4. Check event counts updating

## 🔧 Dashboard Features

### A/B Testing View:
- Real-time event count display
- Metrics comparison (conversion rates, session duration, etc.)
- Mock session recordings with controls
- User flow analysis
- AI-powered insights

### Data Sources:
- Live Amplitude API integration
- Fallback to mock data when API unavailable
- Real-time event streaming from test website

## 📈 Key Metrics Tracked

### Conversion Metrics:
- Hero CTA click rate
- Pricing plan selection rate
- Form completion rate
- Session duration
- Bounce rate

### A/B Test Metrics:
- Variant exposure rates
- Conversion lift per variant
- Statistical significance
- User segment performance

## 🛠 Technical Implementation

### Amplitude SDK Setup:
```typescript
// Full SDK initialization with session replay
amplitude.init(API_KEY, {
  defaultTracking: {
    pageViews: true,
    sessions: true,
    formInteractions: true,
  },
  sessionId: Date.now(),
  userId: generateUserId(),
});

// Session replay plugin
amplitude.add(sessionReplayPlugin({
  sampleRate: 1.0,
  maskAllInputs: false,
}));

// Experiment client
experimentClient = Experiment.initialize(DEPLOYMENT_KEY);
```

### A/B Testing Wrapper:
```typescript
<ABTestWrapper flagKey="hero_layout_test">
  {(variant, trackConversion) => (
    // Render different variants based on flag
    variant === 'variant_b' ? <VariantB /> : <VariantA />
  )}
</ABTestWrapper>
```

## 🎨 Puck Editor Integration

### Visual Editing:
- Component-based editing system
- Real-time preview
- Drag & drop interface
- Custom component library

### A/B Test Creation:
- Visual variant creation
- Component property modification
- Layout adjustments
- Content editing

## 🔍 Debugging & Monitoring

### Browser Console:
- Event tracking logs
- Experiment variant assignments
- API call results
- Error messages

### Amplitude Dashboard:
- Real-time event stream
- User session details
- Conversion funnel analysis
- A/B test results

## 🚀 Next Steps

1. **Create Amplitude Experiments**: Set up actual experiments in Amplitude dashboard
2. **Configure Feature Flags**: Define variants and targeting rules
3. **Set Conversion Goals**: Define success metrics for each test
4. **Launch Tests**: Start collecting real user data
5. **Analyze Results**: Use dashboard to monitor performance

## 📝 Notes

- All events include timestamp and user context
- Session replay captures 100% of sessions for demo purposes
- Dashboard shows live data when Amplitude API is available
- Fallback mock data ensures demo always works
- A/B tests use client-side evaluation for real-time results