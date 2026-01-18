import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { slides } from "./slides";

interface SlideContextType {
  currentSlide: number;
  totalSlides: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

const SlideContext = createContext<SlideContextType | null>(null);

export function SlideProvider({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = useCallback(() => {
    if (canGoNext) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [canGoNext]);

  const prevSlide = useCallback(() => {
    if (canGoPrev) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [canGoPrev]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextSlide();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <SlideContext.Provider
      value={{
        currentSlide,
        totalSlides,
        nextSlide,
        prevSlide,
        goToSlide,
        canGoNext,
        canGoPrev,
      }}
    >
      {children}
    </SlideContext.Provider>
  );
}

export function useSlides() {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlides must be used within a SlideProvider");
  }
  return context;
}
