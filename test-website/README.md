# Test Website - Puck + Amplitude Integration

This is a demo SaaS landing page built with Puck visual editor and Amplitude analytics integration for A/B testing.

## Features

- **Puck Visual Editor**: Edit components visually at `/edit`
- **Amplitude Analytics**: Track user interactions and page views
- **A/B Testing**: Test different variants of components
- **Real-time Tracking**: Events are sent to Amplitude for analysis

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5175 to view the landing page
4. Visit http://localhost:5175/edit to use the Puck editor

## Amplitude Integration

The website tracks the following events:
- `page_view` - When a page loads
- `button_clicked` - When CTA buttons are clicked
- `section_viewed` - When sections come into view
- `scroll_depth` - At 25%, 50%, 75%, 100% scroll
- `experiment_exposure` - When A/B test variants are shown

## A/B Testing

The Hero component has A/B testing enabled:
- **Variant A (Control)**: Original design
- **Variant B**: Center-aligned with different copy and styling

## Components

- **Hero**: Main hero section with CTA buttons
- **Stats**: Statistics display section
- **Logos**: Company logos section
- **Text**: Rich text content blocks

## Configuration

Environment variables (in `.env.local`):
- `NEXT_PUBLIC_AMPLITUDE_API_KEY`: Your Amplitude API key
- `NEXT_PUBLIC_AMPLITUDE_PROJECT_ID`: Your Amplitude project ID

## Dashboard Integration

This test website sends data to the dashboard at `../dashboard/frontend` which displays:
- Real-time metrics
- A/B test results
- User flow analysis
- Session recordings (when available)