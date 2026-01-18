"use client";

import React, { useEffect } from 'react';
import { trackPageView, trackSectionView, setUserProperties } from '../lib/amplitude';
import ABTestWrapper from '../components/ABTestWrapper';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // Track page view
    trackPageView('/');
    
    // Set user properties for segmentation
    setUserProperties({
      page_type: 'landing',
      user_segment: 'new_visitor',
      traffic_source: document.referrer || 'direct'
    });
    
    // Track sections as they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.getAttribute('data-section');
          if (sectionName) {
            trackSectionView(sectionName);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-section]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section with A/B Testing */}
      <section data-section="hero" className="hero-section">
        <ABTestWrapper flagKey="hero_layout_test">
          {(variant, trackConversion) => (
            <div className={`hero-content ${variant === 'variant_b' ? 'hero-centered' : 'hero-left'}`}>
              {variant === 'variant_b' ? (
                // Variant B: Center layout with different copy
                <>
                  <h1 className="hero-title-large">🚀 Transform Your Workflow</h1>
                  <p className="hero-subtitle-large">
                    Join 10,000+ teams using our AI-powered platform to boost productivity by 300%
                  </p>
                  <div className="hero-buttons-centered">
                    <button 
                      className="cta-button primary-large"
                      onClick={() => trackConversion('hero_primary_cta', 1)}
                    >
                      Start Free Trial
                    </button>
                    <button 
                      className="cta-button secondary-large"
                      onClick={() => trackConversion('hero_secondary_cta', 1)}
                    >
                      Watch Demo
                    </button>
                  </div>
                </>
              ) : (
                // Variant A: Left-aligned layout (control)
                <>
                  <h1 className="hero-title">Welcome to Our SaaS Platform</h1>
                  <p className="hero-subtitle">
                    Streamline your workflow with our powerful tools and integrations
                  </p>
                  <div className="hero-buttons">
                    <button 
                      className="cta-button primary"
                      onClick={() => trackConversion('hero_primary_cta', 1)}
                    >
                      Get Started
                    </button>
                    <button 
                      className="cta-button secondary"
                      onClick={() => trackConversion('hero_secondary_cta', 1)}
                    >
                      Learn More
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </ABTestWrapper>
      </section>

      {/* Features Section */}
      <section data-section="features" className="features-section">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🎯 Smart Analytics</h3>
              <p>Real-time insights into your business performance</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Lightning Fast</h3>
              <p>Optimized for speed and performance</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Secure</h3>
              <p>Enterprise-grade security and compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with A/B Testing */}
      <section data-section="pricing" className="pricing-section">
        <div className="container">
          <ABTestWrapper flagKey="pricing_layout_test">
            {(variant, trackConversion) => (
              <>
                <h2>{variant === 'variant_b' ? 'Choose Your Plan' : 'Simple Pricing'}</h2>
                <div className={`pricing-grid ${variant === 'variant_b' ? 'pricing-highlight' : ''}`}>
                  <div className="pricing-card">
                    <h3>Starter</h3>
                    <div className="price">$29/mo</div>
                    <ul>
                      <li>Up to 5 users</li>
                      <li>Basic analytics</li>
                      <li>Email support</li>
                    </ul>
                    <button 
                      className="pricing-button"
                      onClick={() => trackConversion('pricing_starter', 29)}
                    >
                      Choose Starter
                    </button>
                  </div>
                  <div className={`pricing-card ${variant === 'variant_b' ? 'featured' : ''}`}>
                    <h3>Professional</h3>
                    <div className="price">$99/mo</div>
                    <ul>
                      <li>Up to 25 users</li>
                      <li>Advanced analytics</li>
                      <li>Priority support</li>
                      <li>API access</li>
                    </ul>
                    <button 
                      className="pricing-button primary"
                      onClick={() => trackConversion('pricing_professional', 99)}
                    >
                      Choose Professional
                    </button>
                  </div>
                  <div className="pricing-card">
                    <h3>Enterprise</h3>
                    <div className="price">Custom</div>
                    <ul>
                      <li>Unlimited users</li>
                      <li>Custom integrations</li>
                      <li>Dedicated support</li>
                      <li>SLA guarantee</li>
                    </ul>
                    <button 
                      className="pricing-button"
                      onClick={() => trackConversion('pricing_enterprise', 0)}
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </>
            )}
          </ABTestWrapper>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;