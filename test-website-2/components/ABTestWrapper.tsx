"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { getExperimentVariant, trackConversion, trackUserFlow } from '../lib/amplitude';

interface ABTestWrapperProps {
  flagKey: string;
  children: (variant: string, trackConversion: (type: string, value?: number) => void) => ReactNode;
  fallback?: ReactNode;
  onVariantLoaded?: (variant: string) => void;
}

export const ABTestWrapper: React.FC<ABTestWrapperProps> = ({ 
  flagKey, 
  children, 
  fallback = null,
  onVariantLoaded
}) => {
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const variantValue = await getExperimentVariant(flagKey);
        setVariant(variantValue);
        
        // Track user flow step
        trackUserFlow('experiment_loaded', flagKey, { variant: variantValue });
        
        // Callback for parent component
        if (onVariantLoaded) {
          onVariantLoaded(variantValue);
        }
      } catch (error) {
        console.error('Error fetching experiment variant:', error);
        setVariant('control');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariant();
  }, [flagKey, onVariantLoaded]);

  const handleConversion = (type: string, value?: number) => {
    trackConversion(type, value, {
      experiment_flag: flagKey,
      experiment_variant: variant,
      timestamp: Date.now()
    });
  };

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children(variant || 'control', handleConversion)}</>;
};

export default ABTestWrapper;