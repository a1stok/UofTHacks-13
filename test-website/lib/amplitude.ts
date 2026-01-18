import * as amplitude from '@amplitude/analytics-browser';
import { Experiment } from '@amplitude/experiment-js-client';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY || '5db81c9f1e029ea3cd6e8ad31a9f3129';
const DEPLOYMENT_KEY = import.meta.env.VITE_AMPLITUDE_DEPLOYMENT_KEY || 'client-DvWljI8jjbc6iMtSP9HK52R2FfkbZQA';

let isInitialized = false;
let experimentClient: any = null;

export const initializeAmplitude = () => {
  if (!isInitialized) {
    // Initialize Amplitude with session replay
    amplitude.init(AMPLITUDE_API_KEY, {
      defaultTracking: {
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
      },
      sessionId: Date.now(),
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
    });
    
    // Add session replay plugin
    amplitude.add(sessionReplayPlugin({
      sampleRate: 1.0, // Record 100% of sessions for demo
      maskAllInputs: false,
      maskAllText: false,
    }));
    
    // Initialize experiment client with proper configuration
    try {
      experimentClient = Experiment.initialize(DEPLOYMENT_KEY, {
        debug: true,
        fallbackVariant: {},
        initialVariants: {},
        source: 'initial-variants',
      });
      
      // Start fetching variants
      experimentClient.start();
    } catch (error) {
      console.error('Failed to initialize experiment client:', error);
    }
    
    isInitialized = true;
    console.log('Amplitude initialized with session replay and experiments');
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isInitialized) {
    initializeAmplitude();
  }
  
  amplitude.track(eventName, properties);
  console.log('Tracked event:', eventName, properties);
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { path });
};

export const trackButtonClick = (buttonText: string, location: string) => {
  trackEvent('button_clicked', { 
    button_text: buttonText,
    location: location,
    timestamp: Date.now()
  });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_viewed', { 
    section: sectionName,
    timestamp: Date.now()
  });
};

export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', { 
    depth_percentage: depth,
    timestamp: Date.now()
  });
};

export const getExperimentVariant = async (flagKey: string) => {
  if (!experimentClient) {
    console.warn('Experiment client not initialized, returning control');
    return 'control';
  }
  
  try {
    await experimentClient.start();
    const variant = experimentClient.variant(flagKey);
    const variantValue = variant.value || 'control';
    
    // Track experiment exposure
    trackEvent('experiment_exposure', {
      flag_key: flagKey,
      variant: variantValue,
      experiment_id: variant.key || flagKey,
      timestamp: Date.now()
    });
    
    console.log(`Experiment ${flagKey}: ${variantValue}`, variant);
    return variantValue;
  } catch (error) {
    console.error('Error getting experiment variant:', error);
    return 'control';
  }
};

// Enhanced tracking functions for A/B testing
export const trackConversion = (conversionType: string, value?: number, properties?: Record<string, any>) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value || 1,
    timestamp: Date.now(),
    ...properties
  });
};

export const trackUserFlow = (step: string, flowName: string, properties?: Record<string, any>) => {
  trackEvent('user_flow_step', {
    step,
    flow_name: flowName,
    timestamp: Date.now(),
    ...properties
  });
};

export const trackElementInteraction = (element: string, action: string, properties?: Record<string, any>) => {
  trackEvent('element_interaction', {
    element,
    action,
    timestamp: Date.now(),
    page_url: window.location.href,
    ...properties
  });
};

export const trackFormSubmission = (formName: string, success: boolean, properties?: Record<string, any>) => {
  trackEvent('form_submission', {
    form_name: formName,
    success,
    timestamp: Date.now(),
    ...properties
  });
};

export const setUserProperties = (properties: Record<string, any>) => {
  amplitude.setUserId(properties.userId || amplitude.getUserId());
  amplitude.identify(new amplitude.Identify().setOnce('first_seen', new Date().toISOString()).set(properties));
};

// Initialize on import
if (typeof window !== 'undefined') {
  initializeAmplitude();
}