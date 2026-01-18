"use client";

import React from 'react';
import ABTestWrapper from './ABTestWrapper';
import { Hero } from '../config/blocks/Hero/Hero';
import { HeroProps } from '../config/blocks/Hero/Hero';
import { trackUserFlow, trackElementInteraction } from '../lib/amplitude';

interface VariantHeroProps extends HeroProps {
  puck: any;
}

export const VariantHero: React.FC<VariantHeroProps> = (props) => {
  const handleCTAClick = (variant: string, buttonLabel: string, trackConversion: Function) => {
    // Track the click interaction
    trackElementInteraction('hero_cta_button', 'click', {
      button_label: buttonLabel,
      experiment_variant: variant
    });
    
    // Track user flow
    trackUserFlow('cta_clicked', 'hero_conversion_flow', {
      variant,
      button_label: buttonLabel
    });
    
    // Track conversion
    trackConversion('hero_cta_click', 1);
  };

  return (
    <ABTestWrapper 
      flagKey="hero_variant_test"
      onVariantLoaded={(variant) => {
        console.log(`Hero A/B Test: Showing variant ${variant}`);
      }}
    >
      {(variant, trackConversion) => {
        if (variant === 'variant_b') {
          // Variant B: Center aligned with different styling and copy
          return (
            <Hero
              {...props}
              align="center"
              title="🚀 Revolutionary SaaS Platform"
              description="<p><strong>Experience the future of productivity</strong> with our cutting-edge solution designed for modern teams. Join 10,000+ companies already transforming their workflow.</p>"
              buttons={[
                { 
                  label: "Start Free Trial", 
                  href: "#signup", 
                  variant: "primary",
                  onClick: () => handleCTAClick(variant, "Start Free Trial", trackConversion)
                },
                { 
                  label: "Watch Demo", 
                  href: "#demo", 
                  variant: "secondary",
                  onClick: () => handleCTAClick(variant, "Watch Demo", trackConversion)
                }
              ]}
            />
          );
        }
        
        // Variant A (Control): Original design
        return (
          <Hero
            {...props}
            buttons={props.buttons.map(button => ({
              ...button,
              onClick: () => handleCTAClick(variant, button.label, trackConversion)
            }))}
          />
        );
      }}
    </ABTestWrapper>
  );
};

export default VariantHero;